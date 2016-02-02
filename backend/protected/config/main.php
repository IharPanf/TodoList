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
	),
);