<?php
/**
 * Contao Open Source CMS
 *
 * Copyright (C) 2005-2013 Leo Feyer
 *
 * @package
 * @author    Sebastian Tilch
 * @license   LGPL
 * @copyright Sebastian Tilch 2013
 */

/**
 * Table tl_todo
 */
$GLOBALS['TL_DCA']['tl_todo'] = array
(

	// Config
	'config' => array
	(
		'dataContainer'               => 'Table',
		'closed'					  => true,
		'notEditable'                 => true,
		'sql' => array
		(
			'keys' => array
			(
				'id' => 'primary'
			)
		)
	),

	// List
	'list' => array
	(
		'sorting' => array
		(
			'mode'                    => 1,
			'fields'                  => array('id'),
			'flag'                    => 1,
			'disableGrouping'		  => true,
			'panelLayout'             => 'filter;limit'
		),
		'label' => array
		(
			'fields'                  => array('title'),
			'format'                  => '%s',
			'label_callback'		  => array('Todo\DcaTodo','getRow')
		),
		'global_operations' => array
		(
			'all' => array
			(
				'label'               => &$GLOBALS['TL_LANG']['MSC']['all'],
				'href'                => 'act=select',
				'class'               => 'header_edit_all',
				'attributes'          => 'onclick="Backend.getScrollOffset()" accesskey="e"'
			)
		),
		'operations' => array
		(
			'delete' => array
			(
				'label'               => &$GLOBALS['TL_LANG']['tl_todo']['delete'],
				'href'                => 'act=delete',
				'icon'                => 'delete.gif',
				'attributes'          => 'onclick="if(!confirm(\'' . $GLOBALS['TL_LANG']['MSC']['deleteConfirm'] . '\'))return false;Backend.getScrollOffset()"'
			),
			'show' => array
			(
				'label'               => &$GLOBALS['TL_LANG']['tl_todo']['show'],
				'href'                => 'act=show',
				'icon'                => 'show.gif'
			)
		)
	),

	// Fields
	'fields' => array
	(
		'id' => array
		(
			'sql'                     => "int(10) unsigned NOT NULL auto_increment"
		),
		'tstamp' => array
		(
			'label'                   => &$GLOBALS['TL_LANG']['tl_todo']['tstamp'],
			'flag'                    => 6,
			'sql'                     => "int(10) unsigned NOT NULL default '0'"
		),
		'title' => array
		(
			'label'                   => &$GLOBALS['TL_LANG']['tl_todo']['title'],
			'sql'                     => "varchar(255) NOT NULL default ''"
		),
		'done' => array
		(
			'label'                   => &$GLOBALS['TL_LANG']['tl_todo']['done'],
			'filter'                  => true,
			'sql'                     => "char(1) NOT NULL default ''",
			'eval'					  => array('isBoolean'=>true)
		),
		'author' => array
		(
			'label'                   => &$GLOBALS['TL_LANG']['tl_todo']['author'],
			'foreignKey'              => 'tl_member.username',
			'filter'                  => true,
			'sql'                     => "int(10) unsigned NOT NULL default '0'",
			'relation'                => array('type'=>'hasOne', 'load'=>'eager')
		)
	)
);