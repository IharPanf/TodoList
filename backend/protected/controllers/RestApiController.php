<?php

class RestApiController extends CController
{
	public function init()
	{
		parent::init();
		if ($action = Yii::app()->request->getParam('action', null))
		{
			$action = 'action' . ucfirst($action);

			if (in_array($action, get_class_methods(__CLASS__)))
			{
				call_user_func(array(get_class(), $action)); // Вызываем действие
			}
		}
	}

	public function actionIndex(){echo '+++';}

	public function actionAdd()
	{
		$connection = Yii::app()->db;
		$sql = "INSERT INTO  `todos` (`task`, `date_task`,`id_status` ,`id_priority` ) VALUES ('qweqweqe', '2016-12-01', 1, 1)";
		$dataReader = $connection->createCommand($sql);
		$dataReader->query();
	}
	public function actionShow()
	{
		$connection = Yii::app()->db;
		$dataReader = $connection->createCommand()
			->select('task as textTask,
								  date_task as dateStart,
								  name as status,
								  val_priority as priority')
			->from('todos a')
			->join('status b', 'b.id = a.id_status')
			->join('priority c', 'c.id = a.id_priority')
			->query();

		// получаем все строки разом в виде массива
		$rows = $dataReader->readAll();
		echo CJavaScript::jsonEncode($rows);
		Yii::app()->end();
	}
	public function actionDelete()
	{
/*		$connection = Yii::app()->db;
		$sql = "DELETE FROM `todos` WHERE id > 4";
		$dataReader = $connection->createCommand($sql);
		$dataReader->query();
*/	}
	public function actionUpdate()
	{
/*		$connection = Yii::app()->db;
		$sql = "UPDATE `todos` SET `id_status`= 0 WHERE id > 4";
		$dataReader = $connection->createCommand($sql);
		$dataReader->query();
*/	}
}
