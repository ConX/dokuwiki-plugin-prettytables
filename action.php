<?php
/**
 * DokuWiki Plugin prettytables (Action Component)
 *
 * @license GPL 2 http://www.gnu.org/licenses/gpl-2.0.html
 * @author  Constantinos Xanthopoulos <conx@xanthopoulos.info>
 */

// must be run within Dokuwiki
if (!defined('DOKU_INC')) die();

if (!defined('DOKU_LF')) define('DOKU_LF', "\n");
if (!defined('DOKU_TAB')) define('DOKU_TAB', "\t");
if (!defined('DOKU_PLUGIN')) define('DOKU_PLUGIN',DOKU_INC.'lib/plugins/');

require_once DOKU_PLUGIN.'action.php';

class action_plugin_prettytables extends DokuWiki_Action_Plugin {

    public function register(Doku_Event_Handler &$controller) {
    	$controller->register_hook('TOOLBAR_DEFINE', 'AFTER', $this, 'insert_button');
   
    }

    public function insert_button(Doku_Event &$event, $param) {
    	$event->data[] = array (
        	'type' => 'prettytables',
                'title' => 'Fix table syntax',
                'icon' => '../../plugins/prettytables/plugin.png',
                );
    }

}

// vim:ts=4:sw=4:et:
