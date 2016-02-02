<?php

class ApiController extends CController
{
	public function actionIndex()
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
//		foreach($dataReader as $row) {
//		}

		// получаем все строки разом в виде массива
		$rows = $dataReader->readAll();
		echo CJavaScript::jsonEncode($rows);
		Yii::app()->end();
	}
}
