<?php
/**
 * Created by PhpStorm.
 * User: i.panfilenko
 * Date: 04.02.2016
 * Time: 15:41
 */

class Todos extends CActiveRecord
{
    public static function model($className=__CLASS__)
    {
        return parent::model($className);
    }

    public function tableName()
    {
        return 'todos';
    }
}