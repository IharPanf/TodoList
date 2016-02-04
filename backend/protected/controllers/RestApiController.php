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

	public function actionIndex(){echo 'default action';}

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
		$id = $_GET['id'];
		$sql = "DELETE FROM `todos` WHERE id = $id";
		$dataReader = $connection->createCommand($sql);
		$dataReader->query();
	}
	public function actionUpdate()
	{
		$connection = Yii::app()->db;
		$request = file_get_contents('php://input');
		$data = (array) json_decode($request);
		$status = $data['status'];
		$id = $data['id'];
		$sql = "UPDATE `todos` SET `status`= '$status' WHERE id = $id";
		$dataReader = $connection->createCommand($sql);
		$dataReader->query();
	}
}
