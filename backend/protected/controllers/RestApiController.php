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
				call_user_func(array(get_class(), $action)); // Âûçûâàåì äåéñòâèå
			}
		}
	}

	public function actionIndex(){
		$models = Todos::model()->findAll();
	}

	public function actionAdd()
	{
		$request = file_get_contents('php://input');
		$data = (array) json_decode($request);
		$newTask = new Todos;
		$newTask->textTask = $data['textTask'];
		$newTask->priority = $data['priority'];
		$newTask->status = $data['status'];
		$newTask->dateStart = $data['dateStart'];
		$newTask->save();
	}
	public function actionShow()
	{
		$models = Todos::model()->findAll();
		echo CJavaScript::jsonEncode($models);
	}
	public function actionDestroy()
	{
		$id = $_GET['id'];
		$newTask = Todos::model()->findByPk($id);
		$newTask->delete();
	}
	public function actionUpdate()
	{
		$request = file_get_contents('php://input');
		$data = (array) json_decode($request);
		$newTask = Todos::model()->findByPk($data['id']);
		$newTask->status = $data['status'];
		$newTask->save();
	}
}
