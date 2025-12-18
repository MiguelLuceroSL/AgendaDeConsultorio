-- Agregar columna sucursal_id a la tabla turnos
-- Ejecutar este script en phpMyAdmin o MySQL Workbench

ALTER TABLE `turnos` 
ADD COLUMN `sucursal_id` INT(11) NULL AFTER `profesional_especialidad_id`,
ADD CONSTRAINT `fk_turno_sucursal` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursal` (`id`) ON DELETE SET NULL;
