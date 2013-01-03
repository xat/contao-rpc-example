<?php
/**
 * Contao Open Source CMS
 *
 * Copyright (C) 2005-2012 Leo Feyer
 *
 * @package
 * @author    Sebastian Tilch
 * @license   LGPL
 * @copyright Sebastian Tilch 2013
 */

$GLOBALS['BE_MOD']['content']['todolist'] = array
(
	'tables'  => array('tl_todo'),
	'icon'    => 'system/modules/Todo/html/icons/todo.png'
);

// RPC METHODS
$GLOBALS['RPC']['methods']['Todo.create'] = array
(
	'call' => array('Contao\Todo\TodoController', 'create')
);
$GLOBALS['RPC']['methods']['Todo.retrieve'] = array
(
	'call' => array('Contao\Todo\TodoController', 'retrieve')
);
$GLOBALS['RPC']['methods']['Todo.update'] = array
(
	'call' => array('Contao\Todo\TodoController', 'update')
);
$GLOBALS['RPC']['methods']['Todo.delete'] = array
(
	'call' => array('Contao\Todo\TodoController', 'delete')
);