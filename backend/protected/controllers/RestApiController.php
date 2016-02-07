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
				call_user_func(array(get_class(), $action)); // Âûחûגאול הויסעגטו
			}
		}
	}

	public function actionIndex(){}

	public function actionAdd()
	{
		$data = Yii::app()->request->getRestParams();
		$newTask = new Todos;
		$newTask->textTask = $data['textTask'];
		$newTask->priority = $data['priority'];
		$newTask->status = $data['status'];
		$newTask->dateStart = $data['dateStart'];
		if($newTask->save())
		{
			$this->_sendResponse(200, CJSON::encode($newTask));
		}
		else
		{
			$this->_sendResponse(500, 'Error: the model is not saved' );
		}
	}
	public function actionShow()
	{
		$models = Todos::model()->findAll();
		$this->_sendResponse(200, CJavaScript::jsonEncode($models));
	}
	public function actionDestroy()
	{
		$id 		= (int) Yii::app()->request->getParam('id');
		$newTask 	= Todos::model()->findByPk($id);
		if($newTask->delete() > 0)
		{
			$this->_sendResponse(200, 'Success: the model is deleted.');
		}
		else
		{
			$this->_sendResponse(500, "Error: Couldn't delete model");
		}
	}
	public function actionUpdate()
	{
		$data = Yii::app()->request->getRestParams();
		$newTask = Todos::model()->findByPk($data['id']);
		$newTask->status = $data['status'];
		if($newTask->save())
		{
			$this->_sendResponse(200, CJSON::encode($newTask));
		}
		else
		{
			$this->_sendResponse(500, 'Error: the model is not saved' );
		};
	}

	private function _sendResponse($status = 200, $body = '', $content_type = 'text/html')
	{
		$status_header = 'HTTP/1.1 ' . $status . ' ' . $this->_getStatusCodeMessage($status);
		header($status_header);
		header('Content-type: ' . $content_type);

		if($body != '')
		{
			echo $body;
		}
		else
		{
			$message = '';

			switch($status)
			{
				case 401:
					$message = 'You must be authorized to view this page.';
					break;
				case 404:
					$message = 'The requested URL ' . $_SERVER['REQUEST_URI'] . ' was not found.';
					break;
				case 500:
					$message = 'The server encountered an error processing your request.';
					break;
				case 501:
					$message = 'The requested method is not implemented.';
					break;
			}

			$signature = ($_SERVER['SERVER_SIGNATURE'] == '') ? $_SERVER['SERVER_SOFTWARE'] . ' Server at ' . $_SERVER['SERVER_NAME'] . ' Port ' . $_SERVER['SERVER_PORT'] : $_SERVER['SERVER_SIGNATURE'];

			$body = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
					<html>
					<head>
    				<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
    				<title>' . $status . ' ' . $this->_getStatusCodeMessage($status) . '</title>
					</head>
					<body>
    				<h1>' . $this->_getStatusCodeMessage($status) . '</h1>
    				<p>' . $message . '</p>
    				<hr />
    				<address>' . $signature . '</address>
					</body>
					</html>';

			echo $body;
		}
		Yii::app()->end();
	}

	private function _getStatusCodeMessage($status)
	{
		$codes = Array(
			200 => 'OK',
			400 => 'Bad Request',
			401 => 'Unauthorized',
			402 => 'Payment Required',
			403 => 'Forbidden',
			404 => 'Not Found',
			500 => 'Internal Server Error',
			501 => 'Not Implemented',
		);
		return (isset($codes[$status])) ? $codes[$status] : '';
	}
}
