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

namespace Contao\Todo;

/**
 * TodoController
 * Provide CRUD methods to handle RPC requests
 */
class TodoController extends \System{

	public function __construct()
	{
		parent::__construct();
		$this->import('FrontendUser', 'User');
	}

	/**
	 * Create a new todo
	 * @param  object $objRequest  Request object
	 * @param  object $objResponse Response object
	 */
	public function create($objRequest, $objResponse)
	{
		$arrData = $objResponse->getParams();
		$objTodo = new TodoModel();

		$objTodo->title  = $arrData['title'];
		$objTodo->done   = strlen($arrData['done']);
		$objTodo->author = $this->User->id;

		$objTodo = $objTodo->save();
		$arrData = array
		(
			'id'    => $objTodo->id,
			'title' => $objTodo->title,
			'done'  => strlen($objTodo->done) ? true : false
		);
		$objResponse->setData($arrData);
	}

	/**
	 * Retrieve all todos and return them
	 * @param  object $objRequest  Request object
	 * @param  object $objResponse Response object
	 */
	public function retrieve($objRequest, $objResponse)
	{
		$arrData = array();
		$objTodo = TodoModel::findAll();
		while($objTodo->next())
		{
			$arrData[] = array
			(
				'id'    => $objTodo->id,
				'title' => $objTodo->title,
				'done'  => strlen($objTodo->done) ? true : false
			);
		}
		$objResponse->setData($arrData);
	}

	/**
	 * Update a todo
	 * @param  object $objRequest  Request object
	 * @param  object $objResponse Response object
	 */
	public function update($objRequest, $objResponse)
	{
		$arrData = $objRequest->getParams();

		$objTodo = TodoModel::findByPk($arrData['id']);
		if (isset($objTodo))
		{
			$objTodo->title  = $arrData['title'];
			$objTodo->done   = strlen($arrData['done']);
			$objTodo->author = $this->User->id;

			$objTodo->save();
		}
		else
		{
			$objResponse->setErrorType(RpcResponse::INVALID_PARAMS);
		}
	}

	/**
	 * Delete a todo
	 * @param  object $objRequest  Request object
	 * @param  object $objResponse Response object
	 */
	public function delete($objRequest, $objResponse)
	{
		$arrData = $objRequest->getParams();

		$objTodo = TodoModel::findByPk($arrData['id']);
		if (isset($objTodo))
		{
			$objTodo->delete();
		}
		else
		{
			$objResponse->setErrorType(RpcResponse::INVALID_PARAMS);
		}
	}
}
