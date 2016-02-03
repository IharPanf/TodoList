<?php

return array(
	'basePath'=>dirname(__FILE__).DIRECTORY_SEPARATOR.'..',
	'name'=>'Use Rest Api',
	'defaultController'=>'restapi',
	'components'=>array(
		'db' => array(
				'connectionString' => 'mysql:host=localhost;dbname=todo',
				'emulatePrepare' => true,
				'username' => 'root',
				'password' => '',
				'charset' => 'utf8',
				'enableProfiling' => true,
		),
		'urlManager'         => array(
			'urlFormat'      => 'path',
			'showScriptName' => false,
			'rules'          => array(
				'' => 'restapi/show',
//				'add' => 'restapi/add'
//				array('show' => 'restapi/show', 'verb' => 'POST'),
//			'<action>'=>'<controller>/<action>'
			)
		)
	),
);