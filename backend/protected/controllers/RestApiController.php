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
		$request = file_get_contents('php://input');
		$data = (array) json_decode($request);
		$task = $data['textTask'];
		$priority = $data['priority'];
		$status = $data['status'];
		$dateStart = $data['dateStart'];
		$sql = "INSERT INTO `todos` (`task`,
									 `date_task`,
									 `status` ,
									 `priority` )
					   		VALUES ('$task',
				 			   		'$dateStart',
				 			   		'$status',
				 		 			'$priority')";

		$dataReader = $connection->createCommand($sql);
		$dataReader->query();
	}
	public function actionShow()
	{
		$connection = Yii::app()->db;
		$dataReader = $connection->createCommand()
							->select('id,
									  task as textTask,
								  	  date_task as dateStart,
								      status,
								      priority')
							->from('todos')
							->query();

		// получаем все строки разом в виде массива
		$rows = $dataReader->readAll();
		echo CJavaScript::jsonEncode($rows);
		Yii::app()->end();
	}
	public function actionDestroy()
	{
		$connection = Yii::app()->db;
		$request = file_get_contents('php://input');
		$data = (array) json_decode($request);
		$task = $data['id'];
		$sql = "DELETE FROM `todos` WHERE id = $task";
		$dataReader = $connection->createCommand($sql);
		$dataReader->query();
	}
	public function actionUpdate()
	{
/*		$connection = Yii::app()->db;
		$sql = "UPDATE `todos` SET `id_status`= 0 WHERE id > 4";
		$dataReader = $connection->createCommand($sql);
		$dataReader->query();
*/	}
}
