<?php

class ApiController extends CController
{
	public function actionIndex()
	{
		$connection = Yii::app()->db;

		$dataReader = $connection->createCommand()
						->select('name')
						->from('status')
						->query();

		foreach($dataReader as $row) {
			print_r($row);
		}
		// получаем все строки разом в виде массива
	//	$rows=$dataReader->readAll();
	}
}