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
//		foreach($dataReader as $row) {
//		}

		// �������� ��� ������ ����� � ���� �������
		$rows = $dataReader->readAll();
		echo CJavaScript::jsonEncode($rows);
//		Yii::app()->end();
	}
}