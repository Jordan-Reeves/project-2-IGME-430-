/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./client/notFound.jsx":
/*!*****************************!*\
  !*** ./client/notFound.jsx ***!
  \*****************************/
/***/ (() => {

eval("const init = async () => {\n  const loginButton = document.getElementById('loginButton');\n  const signupButton = document.getElementById('signupButton');\n  loginButton.addEventListener('click', e => {\n    e.preventDefault();\n    window.location = \"/\";\n    return false;\n  });\n  signupButton.addEventListener('click', e => {\n    e.preventDefault();\n    window.location = \"/\";\n    return false;\n  });\n};\nwindow.onload = init;\n\n//# sourceURL=webpack://mood-board-maker/./client/notFound.jsx?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./client/notFound.jsx"]();
/******/ 	
/******/ })()
;