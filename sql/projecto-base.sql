DROP SCHEMA ALDEBERAN;
CREATE SCHEMA ALDEBERAN;

CREATE TABLE ALDEBERAN.Persona (
  nombre varchar(50) not null,
  apellido varchar(50) not null,
  email varchar(50) not null,
  edad integer,
  ciudad varchar(50),
  provincia varchar(50),
  tel varchar(10),
  id_persona integer auto_increment unique not null, PRIMARY KEY (id_persona));

CREATE TABLE ALDEBERAN.Empleados (
  cargo varchar(50) not null,
  id_persona integer,
  FOREIGN KEY (id_persona) references ALDEBERAN.Persona(id_persona),
  id_empleado integer auto_increment unique not null, PRIMARY KEY (id_empleado));

CREATE TABLE ALDEBERAN.Clientes (
  id_persona integer,
  FOREIGN KEY (id_persona) references ALDEBERAN.Persona(id_persona),
  id_cliente integer auto_increment unique not null, PRIMARY KEY (id_cliente));

CREATE TABLE ALDEBERAN.Proveedores (
  nombre varchar(50) not null,
  email varchar(50) not null,
  ciudad varchar(50) not null,
  provincia varchar(50) not null,
  tel varchar(10) not null,
  id_empleado integer,
  FOREIGN KEY (id_empleado) references ALDEBERAN.Empleados(id_empleado),
  id_proveedor integer auto_increment unique not null, PRIMARY KEY (id_proveedor));

CREATE TABLE ALDEBERAN.Productos (
  marca varchar(50) not null,
  serie varchar(50) not null,
  garantia varchar(10),
  modelo varchar(15) not null,
  categoria varchar(20),
  descripcion varchar(50),
  precio decimal(40, 2) not null,
  id_proveedor integer,
  FOREIGN KEY (id_proveedor) references ALDEBERAN.Proveedores(id_proveedor),
  id_producto integer auto_increment unique not null, PRIMARY KEY (id_producto));

CREATE TABLE ALDEBERAN.Compra (
  cantidad INT not null,
  total decimal(40, 2) not null,
  id_producto integer,
  FOREIGN KEY (id_producto) references ALDEBERAN.Productos(id_producto),
  id_compra integer auto_increment unique not null, PRIMARY KEY (id_compra));

CREATE TABLE ALDEBERAN.Factura (
  fecha datetime,
  id_compra integer,
  FOREIGN KEY (id_compra) references ALDEBERAN.Compra(id_compra),
  id_factura integer auto_increment unique not null, PRIMARY KEY (id_factura));