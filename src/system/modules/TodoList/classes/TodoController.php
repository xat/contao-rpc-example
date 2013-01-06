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
		$this->import('\Contao\Rpc\RpcFrontendUser', 'User');
	}

	/**
	 * Create a new todo
	 * @param  object $objRequest  Request object
	 * @param  object $objResponse Response object
	 */
	public function create($objRequest, $objResponse)
	{
		$objData = $objRequest->getParams();
		if (strlen($objData->title) > 0)
		{
			$objTodo = new \TodoModel();

			$objTodo->title  = $objData->title;
			$objTodo->done   = ($objData->done)? '1' : '';
			$objTodo->author = $this->User->id;
			$objTodo->tstamp = time();

			$objTodo = $objTodo->save();
			$arrData = array
			(
				'id'    => $objTodo->id,
				'title' => $objTodo->title,
				'done'  => strlen($objTodo->done) ? true : false
			);
			$objResponse->setData($arrData);
		}else{
			$objResponse->setErrorType(\Contao\Rpc\RpcResponse::INVALID_PARAMS);
		}
	}

	/**
	 * Retrieve all todos and return them
	 * @param  object $objRequest  Request object
	 * @param  object $objResponse Response object
	 */
	public function retrieve($objRequest, $objResponse)
	{
		$arrData = array();
		$objTodo = \TodoModel::findAll();

		if (!is_null($objTodo))
		{
			while($objTodo->next())
			{
				$arrData[] = array
				(
					'id'    => $objTodo->id,
					'title' => $objTodo->title,
					'done'  => strlen($objTodo->done) ? true : false
				);
			}
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
		$objData = $objRequest->getParams();
		$objTodo = \TodoModel::findByPk($objData->id);
		if (isset($objTodo) || strlen($objData->title)>0)
		{
			$objTodo->title  = $objData->title;
			$objTodo->done   = ($objData->done)? '1' : '';
			$objTodo->author = $this->User->id;
			$objTodo->save();
		}
		else
		{
			$objResponse->setErrorType(\Contao\Rpc\RpcResponse::INVALID_PARAMS);
		}
	}

	/**
	 * Delete a todo
	 * @param  object $objRequest  Request object
	 * @param  object $objResponse Response object
	 */
	public function delete($objRequest, $objResponse)
	{
		$objData = $objRequest->getParams();
		$objTodo = \TodoModel::findByPk($objData->id);

		if (isset($objTodo))
		{
			$objTodo->delete();
			//$objResponse->setData($objData->id);
		}
		else
		{
			$objResponse->setErrorType(\Contao\Rpc\RpcResponse::INVALID_PARAMS);
		}
	}
}
