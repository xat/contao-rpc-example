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

class DcaTodo{
	public function getRow($arrRow, $strLabel)
	{
		$objAuthor = \Database::getInstance()->prepare("SELECT username FROM tl_member WHERE id=?")->execute($arrRow['author']);
		return '<div' . (strlen($arrRow['done']) ? ' style="text-decoration:line-through"' : '') . '>' . $strLabel . ' (' . $objAuthor->username .')</div>';
	}
}