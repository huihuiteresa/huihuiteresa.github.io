## 类型一
### 建表，添加测试数据
~~~
--删除临时表
if object_id('tempdb..#demo') is not null
     drop table #temp

CREATE TABLE #demo(
    row1 NVARCHAR(10),
	row2 NVARCHAR(10),
	col NVARCHAR(10),
	colval NVARCHAR(10)
);

INSERT INTO #demo (row1,row2,col,colval)VALUES( N'huihui', N'1',N'语文', N'1'  );
INSERT INTO #demo (row1,row2,col,colval)VALUES( N'huihui', N'1',N'数学', N'2'  );
INSERT INTO #demo (row1,row2,col,colval)VALUES( N'huihui', N'1',N'英语', N'3'  );
INSERT INTO #demo (row1,row2,col,colval)VALUES( N'huihui', N'2',N'英语', N'3'  );
INSERT INTO #demo (row1,row2,col,colval)VALUES( N'haha', N'2',N'英语', N'3'  );
~~~

### 行转列sql
~~~
--sql
declare  @col varchar(3000)='', @selCol VARCHAR(3000)='',@sql varchar(3000)='';
select @col=@col+',['+[col]+']'  from (select distinct [col] from #demo) a order by [col];
select @selCol=@selCol+',max(['+[col]+']) as '+'['+[col]+']'  from (select distinct [col] from #demo) a order by [col];
select  @col=right(@col,len(@col)-1);
select  @selCol=right(@selCol,len(@selCol)-1);

set @sql='select row1,row2,'+@selCol+
' from( select row1,row2,'+@col +'from #demo a  
pivot (max(colval) for col in('+@col+') 
) as pv ) b group by row1,row2';
exec(@sql);
~~~


## 类型二

### 建表，添加测试数据
~~~

if object_id('tempdb..#demo') is not null
     drop table #demo

CREATE TABLE #demo(
	sheding NVARCHAR(10),
	pingjun NVARCHAR(10),
	groupType NVARCHAR(10),
	area NVARCHAR(10)
);

INSERT INTO #demo(sheding,pingjun,groupType,area)VALUES(   N'1',N'2','11','1区' );
INSERT INTO #demo(sheding,pingjun,groupType,area)VALUES(   N'3',N'4' ,'11','2区');
INSERT INTO #demo(sheding,pingjun,groupType,area)VALUES(   N'5',N'6','11' ,'3区');
INSERT INTO #demo(sheding,pingjun,groupType,area)VALUES(   N'7',N'8' ,'11','4区');
INSERT INTO #demo(sheding,pingjun,groupType,area)VALUES(   N'9',N'10','11' ,'5区');
INSERT INTO #demo(sheding,pingjun,groupType,area)VALUES(   N'11',N'12' ,'11','6区');
INSERT INTO #demo(sheding,pingjun,groupType,area)VALUES(   N'13',N'14' ,'11','7区');
INSERT INTO #demo(sheding,pingjun,groupType,area)VALUES(   N'15',N'16','11' ,'8区');
INSERT INTO #demo(sheding,pingjun,groupType,area)VALUES(   N'17',N'18','11','9区');
INSERT INTO #demo(sheding,pingjun,groupType,area)VALUES(   N'19',N'20','11' ,'10区');
INSERT INTO #demo(sheding,pingjun,groupType,area)VALUES(   N'21',N'22','11' ,'11区');
INSERT INTO #demo(sheding,pingjun,groupType,area)VALUES(   N'23',N'24' ,'11','12区');
INSERT INTO #demo(sheding,pingjun,groupType,area)VALUES(   N'25',N'26' ,'11','13区');
INSERT INTO #demo(sheding,pingjun,groupType,area)VALUES(   N'27',N'28','11' ,'14区');
INSERT INTO #demo(sheding,pingjun,groupType,area)VALUES(   N'29',N'30' ,'11','15区');
~~~


### 行转列sql
~~~
select * from (
select [groupType],area + n as columname,v from #demo unpivot(v for n in (sheding,pingjun)) a
) b pivot(max(v) for [columname] 
in (
[1区sheding],[1区pingjun],
[2区sheding],[2区pingjun],
[3区sheding],[3区pingjun],
[4区sheding],[4区pingjun],
[5区sheding],[5区pingjun],
[6区sheding],[6区pingjun],
[7区sheding],[7区pingjun],
[8区sheding],[8区pingjun],
[9区sheding],[9区pingjun],
[10区sheding],[10区pingjun],
[11区sheding],[11区pingjun],
[12区sheding],[12区pingjun],
[13区sheding],[13区pingjun],
[14区sheding],[14区pingjun],
[15区sheding],[15区pingjun]
)) as c;
~~~