<?php

return array(
	'name'=>'Use Rest Api',
	'defaultController'=>'api',
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
				array(
					'<controller>/view',
					'pattern' => '<controller:\w+>/view/<id:\d+>',
					'verb'    => 'GET'
				),
				array(
					'<controller>/create',
					'pattern' => '<controller:\w+>/create',
					'verb'    => 'POST'
				),
				array(
					'<controller>/delete',
					'pattern' => '<controller:\w+>/delete',
					'verb'    => 'DELETE'
				)
			)
		)
	),
);