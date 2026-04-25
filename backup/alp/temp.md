~~~sql

--例如这个工单
select FormulaVersion,ProductionLineCode,ProcessSectionCode, *
from PR_WorkOrder where WorkOrderNo='ABMG2026003108';

--1.获取bom数据
select Id bomId, *
from V_BS_BOM where MaterialCode='210310040002' and Version='14';

--2.获取bom主表数据
select Quantity, *
from V_BS_BOM where Id='DD9B5EC7-EB3B-4B83-895D-0AA2529FBA01';

--3.bom详情
select MaterialCode,MaterialName,LossCoefficient,Quantity/1 Quantity, *
from V_BS_BOMMaterialDetail where BomId='DD9B5EC7-EB3B-4B83-895D-0AA2529FBA01';

--4.获取 FeedMaterials
select case when ItemValue='ERP' then 1 else 0 end  IsErp,*
from BS_DataItem where IsActive=1 and CategoryCode='FactoryOperatingStatus' and ItemCode='FactoryOperatingStatus';

select ItemExt1+ItemExt2, *
from BS_DataItem where CategoryCode='LargeMaterial' and IsActive=1 and IsDeleted=0;

--获取物料的需求量
select a.MaterialCode,a.MaterialName,d.DataType,b.Quantity BomQuantity,a.LossCoefficient,a.unit,a.UnitName,c.PlanQuantity,a.Quantity BomDetailQuantity
,d.SkuBclassCode,d.SkuMclassCode,d.SkuMclassName,d.CategoryName,a.SortNum BOMSortNum
into #compute1
from BS_BOMMaterialDetail a
left join bs_bom b on a.BomId=b.Id
left join PR_workOrder c on b.MaterialCode=c.MaterialCode and b.Version=c.FormulaVersion
left join BS_Material d on a.MaterialCode=d.MaterialCode
where c.Id='782B8B31-F944-4025-A946-F8CC3AD6952C' and b.IsDeleted=0 and c.IsDeleted=0 and d.IsDeleted=0;

select isnull(PlanQuantity,0) PlanQuantity,isnull(BomQuantity,0) BomQuantity,isnull(LossCoefficient,0) LossCoefficient
,isnull(BomDetailQuantity,0) BomDetailQuantity
,round(isnull(PlanQuantity,0) * isnull(BomDetailQuantity,0),5) ned --产品计划量=该工单计划量*工单下物料明细所需数量
,MaterialCode,MaterialName,DataType,unit,UnitName,SkuBclassCode,SkuMclassName,SkuMclassCode,CategoryName,BOMSortNum
into #compute2
from #compute1;

select MaterialCode,MaterialName,DataType
,round(ned/BomQuantity,5) PlanQuantity --计划量=产品计划量*物料明细所需数量/物料数量
,LossCoefficient
,round((ned+(ned * LossCoefficient))/BomQuantity,5) NeedQuantity --所需量=计划量+（计划量*损耗系数）/物料数量
,unit,UnitName,SkuBclassCode,SkuMclassCode,SkuMclassName,CategoryName,BOMSortNum
into #compute3
from #compute2;

--这里还有个排序，根据materialname包含{ "瓶", 1 },{ "身标", 2 },{ "背标", 3 },{ "径标", 4 },{ "盖子", 5 },{ "纸箱", 6 }，取最小数组
select MaterialCode,MaterialName,DataType,LossCoefficient,unit,UnitName,SkuBclassCode,SkuMclassCode,SkuMclassName,CategoryName,BOMSortNum
,sum(PlanQuantity) PlanQuantity,sum(NeedQuantity) NeedQuantity
into #bomlist
from #compute3 group by MaterialCode,MaterialName,DataType,BOMSortNum,LossCoefficient,unit,UnitName,SkuBclassCode,SkuMclassCode,SkuMclassName,CategoryName;
--上面结果 bomList


--查询已投料量
select MaterialCode,sum(InputQuantity) itemFeedQty
from (
    select MaterialCode,
       case when OperationType='2' then 0-InputQuantity
            else InputQuantity end InputQuantity
from V_PR_InputMaterialDetail where IsDeleted=0 and WorkOrderNo='ABMG2026003108'
     ) tt group by tt.MaterialCode;

--bomlist中所有的materialcode
--111201040001 113502010008 210213060004   allMatterialCode
--获取：noPTLineLocatorCodes
select l.LocatorCode
into #noPTLineLocatorCodes
from MD_Locator l
left join BS_LocatorPTLine lp on lp.IsDeleted=0 and lp.LocatorCode=l.LocatorCode and l.SubinVenToryCode=lp.SubinVenToryCode
where l.IsDeleted=0 and isnull(lp.ProductionLineCode,'')='';

--提出空罐状态，useStatus=4
--获取stockMats
----糖化工单时候
select *
into #stockMats
from V_PR_MaterialStock
where IsDeleted=0 and ProcessSectionCode='102'
and TargetLocatorCode in (select LocatorCode from #noPTLineLocatorCodes)
and TargetLocatorCode is not null and TargetSubinVenToryCode is not null
and (UseStatus is null or UseStatus!='4') and MaterialCode in ('111201040001','113502010008','210213060004')
order by CreatedOn;
----发酵工单、车间扩培工单
select *
into #stockMats
from V_PR_MaterialStock where IsDeleted=0 and ProcessSectionCode='102'
and TargetLocatorCode is not null and TargetSubinVenToryName is not null
and (UseStatus is null or UseStatus!='4') and MaterialCode in ('111201040001','113502010008','210213060004')
order by CreatedOn;
----过滤工单
select *
into #stockMats
from V_PR_MaterialStock
where IsDeleted=0 and TargetLocatorCode is not null
and TargetSubinVenToryCode is not  null
and (UseStatus is null or UseStatus!='4') and MaterialCode in ('111201040001','113502010008','210213060004')
order by CreatedOn;
----包装工单、返工工单
select l.LocatorCode
into #ptlocatorCodeList
from BS_LocatorPTLine lp
left join MD_Locator l on l.IsDeleted=0 and l.LocatorCode=lp.LocatorCode and l.SubinVenToryCode=lp.SubinVenToryCode
where lp.IsDeleted=0 and lp.ProductionLineCode='1005';
select *
into #stockMats
from V_PR_MaterialStock where IsDeleted=0
and TargetLocatorCode in (select LocatorCode from #ptlocatorCodeList)
and ProcessSectionCode='102' and TargetLocatorCode is not null and TargetSubinVenToryCode is not null
and (UseStatus is null or UseStatus!='4') and MaterialCode in ('111201040001','113502010008','210213060004');


~~~

