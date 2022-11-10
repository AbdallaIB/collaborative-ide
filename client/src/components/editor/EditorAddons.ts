// jshint
import { JSHINT } from 'jshint';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/css/css';

// linters
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/javascript-lint';
import 'codemirror/addon/lint/css-lint';

// selection
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/selection/mark-selection';
import 'codemirror/addon/selection/selection-pointer';

// edit
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/matchtags';

import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/javascript-hint';
import 'codemirror/addon/hint/anyword-hint';
import 'codemirror/addon/hint/html-hint';
import 'codemirror/addon/hint/css-hint';

import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/comment-fold';
import 'codemirror/addon/fold/foldgutter.css';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material-darker.css';

(window as any).JSHINT = JSHINT;
(window as any).CSSLint = require('csslint').CSSLint;
