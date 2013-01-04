<?php

/**
 * Contao Open Source CMS
 * 
 * Copyright (C) 2005-2013 Leo Feyer
 * 
 * @package TodoList
 * @link    http://contao.org
 * @license http://www.gnu.org/licenses/lgpl-3.0.html LGPL
 */


/**
 * Register the namespaces
 */
ClassLoader::addNamespaces(array
(
	'Contao',
));


/**
 * Register the classes
 */
ClassLoader::addClasses(array
(
	// Classes
	'Contao\Todo\DcaTodo'        => 'system/modules/TodoList/classes/DcaTodo.php',
	'Contao\Todo\TodoController' => 'system/modules/TodoList/classes/TodoController.php',
	// Models
	'Contao\TodoModel'      => 'system/modules/TodoList/models/TodoModel.php',
));
