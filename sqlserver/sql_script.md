## 表加注释
~~~
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'注释内容' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'表名'
--例如：
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'系统设置表' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'CM01_SYSTEM'
~~~

## 字段加注释
~~~
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'注释内容' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'表名', @level2type=N'COLUMN',@level2name=N'字段名'
~~~

## 编辑字段注释
~~~
EXEC sp_updateextendedproperty 'MS_Description','字段1','user',dbo,'table','表','column',a1
~~~

## 修改表名
~~~
exec sp_rename '原表名','新表名';
exec sp_rename 'stu','stu2';
~~~

## 序列
~~~
--创建序列
CREATE SEQUENCE [dbo].[WF_SEQ]
 AS [bigint]
 START WITH 10000
 INCREMENT BY 1
 MINVALUE -9223372036854775808
 MAXVALUE 9223372036854775807
 CACHE
GO

--删除序列
drop sequence 序列名
~~~

## 还原数据库提示被占用
~~~
ALTER DATABASE dbname SET OFFLINE WITH ROLLBACK IMMEDIATE
--恢复后
ALTER  database  [ datebase]  set   online
~~~


## SQLserver查询库中包含某个字段的表
~~~
--格式如下：
select [name] from [库名].[dbo].sysobjects where id in(select id from [库名].[dbo].syscolumns Where name='字段名')

--包含SupplierId这个字段的所有表
select [name] from [TPMS_PRD].[dbo].sysobjects 
where id in(select id from [TPMS_PRD].[dbo].syscolumns Where name='supplierid')
~~~