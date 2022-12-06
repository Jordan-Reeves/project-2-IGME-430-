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

/***/ "./client/helper.js":
/*!**************************!*\
  !*** ./client/helper.js ***!
  \**************************/
/***/ ((module) => {

eval("// Accepts and object and displays the message or error of it\nconst sendStatus = message => {\n  // console.log(message);\n  let displayText = '';\n  for (const property in message) {\n    if (property == 'message' || property == \"error\") {\n      console.log(`${property}: ${message[property]}`);\n      displayText += `<p>${property}: ${message[property]}</p>`;\n    }\n  }\n  document.getElementById('statusMessage').innerHTML = displayText;\n  document.getElementById('status').classList.remove('hidden');\n};\n\n/* Sends post requests to the server using fetch. Will look for various\r\n   entries in the response JSON object, and will handle them appropriately.\r\n*/\nconst sendPost = async (url, data, handler) => {\n  const response = await fetch(url, {\n    method: 'POST',\n    headers: {\n      'Content-Type': 'application/json'\n    },\n    body: JSON.stringify(data)\n  });\n\n  // Get the result\n  const result = await response.json();\n  // console.log(result);\n\n  // Hide the status\n  document.getElementById('status').classList.add('hidden');\n\n  // Redirect if needed\n  if (result.redirect) {\n    window.location = result.redirect;\n  }\n\n  // Display the error if neede\n  if (result.error) {\n    sendStatus(result);\n  }\n\n  // Returns the result to the callback/handler\n  if (handler) {\n    handler(result);\n  }\n};\n\n// Hide the status text\nconst hideStatus = () => {\n  document.getElementById('status').classList.add('hidden');\n};\nmodule.exports = {\n  sendStatus,\n  sendPost,\n  hideStatus\n};\n\n//# sourceURL=webpack://mood-board-maker/./client/helper.js?");

/***/ }),

/***/ "./client/login.jsx":
/*!**************************!*\
  !*** ./client/login.jsx ***!
  \**************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("const helper = __webpack_require__(/*! ./helper.js */ \"./client/helper.js\");\n\n// Function to login users\nconst handleLogin = e => {\n  e.preventDefault();\n  helper.hideStatus();\n  const username = e.target.querySelector('#user').value;\n  const pass = e.target.querySelector('#pass').value;\n  const _csrf = e.target.querySelector('#_csrf').value;\n  if (!username || !pass) {\n    helper.sendStatus({\n      error: 'Username or password is empty!'\n    });\n    return false;\n  }\n  helper.sendPost(e.target.action, {\n    username,\n    pass,\n    _csrf\n  });\n  return false;\n};\n\n// Function to signup users\nconst handleSignup = e => {\n  e.preventDefault();\n  helper.hideStatus();\n  const username = e.target.querySelector('#user').value;\n  const pass = e.target.querySelector('#pass').value;\n  const pass2 = e.target.querySelector('#pass2').value;\n  const _csrf = e.target.querySelector('#_csrf').value;\n  if (!username || !pass || !pass2) {\n    helper.sendStatus({\n      error: 'All fields are required!'\n    });\n    return false;\n  }\n  if (pass !== pass2) {\n    helper.sendStatus({\n      error: 'Passwords do not match!'\n    });\n    return false;\n  }\n  helper.sendPost(e.target.action, {\n    username,\n    pass,\n    pass2,\n    _csrf\n  });\n  return false;\n};\n\n// Component for logingin\nconst LoginWindow = props => {\n  return /*#__PURE__*/React.createElement(\"div\", {\n    className: \"relative w-full h-full\"\n  }, /*#__PURE__*/React.createElement(\"div\", {\n    className: \"absolute top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%]\"\n  }, /*#__PURE__*/React.createElement(\"h2\", {\n    className: \"text-lg font-semibold text-center mb-4\"\n  }, \"Login\"), /*#__PURE__*/React.createElement(\"form\", {\n    id: \"loginForm\",\n    name: \"loginForm\",\n    onSubmit: handleLogin,\n    action: \"/login\",\n    method: \"POST\",\n    className: \"mainForm\"\n  }, /*#__PURE__*/React.createElement(\"div\", {\n    className: \"block\"\n  }, /*#__PURE__*/React.createElement(\"label\", {\n    htmlFor: \"username\",\n    className: \"pr-2\"\n  }, \"Username: \"), /*#__PURE__*/React.createElement(\"input\", {\n    id: \"user\",\n    type: \"text\",\n    name: \"username\",\n    className: \"bg-slate-100 my-1 h-3 border border-slate-200 placeholder:text-slate-500 text-sm p-2.5 placeholder:italic\",\n    placeholder: \"New password\"\n  })), /*#__PURE__*/React.createElement(\"div\", {\n    className: \"block\"\n  }, /*#__PURE__*/React.createElement(\"label\", {\n    htmlFor: \"pass\",\n    className: \"pr-2\"\n  }, \"Password: \"), /*#__PURE__*/React.createElement(\"input\", {\n    id: \"pass\",\n    type: \"password\",\n    name: \"pass\",\n    className: \"bg-slate-100 my-1 h-3 border border-slate-200 placeholder:text-slate-500 text-sm p-2.5 placeholder:italic\",\n    placeholder: \"New password\"\n  })), /*#__PURE__*/React.createElement(\"input\", {\n    id: \"_csrf\",\n    type: \"hidden\",\n    name: \"_csrf\",\n    value: props.csrf\n  }), /*#__PURE__*/React.createElement(\"input\", {\n    className: \"formSubmit block rounded border border-1 border-slate-500 bg-slate-100 mx-auto my-4 px-2 hover:bg-emerald-100\",\n    type: \"submit\",\n    value: \"Sign in\"\n  }))));\n};\n\n// Component for signingup\nconst SignupWindow = props => {\n  return /*#__PURE__*/React.createElement(\"div\", {\n    className: \"relative w-full h-full\"\n  }, /*#__PURE__*/React.createElement(\"div\", {\n    className: \"absolute top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%]\"\n  }, /*#__PURE__*/React.createElement(\"h2\", {\n    className: \"text-lg font-semibold text-center mb-4\"\n  }, \"Sign Up!\"), /*#__PURE__*/React.createElement(\"form\", {\n    id: \"signupForm\",\n    name: \"signupForm\",\n    onSubmit: handleSignup,\n    action: \"/signup\",\n    method: \"POST\",\n    className: \"mainForm\"\n  }, /*#__PURE__*/React.createElement(\"div\", {\n    className: \"block\"\n  }, /*#__PURE__*/React.createElement(\"label\", {\n    htmlFor: \"username\",\n    className: \"pr-2\"\n  }, \"Username: \"), /*#__PURE__*/React.createElement(\"input\", {\n    id: \"user\",\n    type: \"text\",\n    name: \"username\",\n    className: \"bg-slate-100 my-1 h-3 border border-slate-200 placeholder:text-slate-500 text-sm p-2.5 placeholder:italic\",\n    placeholder: \"New password\"\n  })), /*#__PURE__*/React.createElement(\"div\", {\n    className: \"block\"\n  }, /*#__PURE__*/React.createElement(\"label\", {\n    htmlFor: \"pass\",\n    className: \"pr-2\"\n  }, \"Password: \"), /*#__PURE__*/React.createElement(\"input\", {\n    id: \"pass\",\n    type: \"password\",\n    name: \"pass\",\n    className: \"bg-slate-100 my-1 h-3 border border-slate-200 placeholder:text-slate-500 text-sm p-2.5 placeholder:italic\",\n    placeholder: \"New password\"\n  })), /*#__PURE__*/React.createElement(\"div\", {\n    className: \"block\"\n  }, /*#__PURE__*/React.createElement(\"label\", {\n    htmlFor: \"pass2\",\n    className: \"pr-2\"\n  }, \"Password: \"), /*#__PURE__*/React.createElement(\"input\", {\n    id: \"pass2\",\n    type: \"password\",\n    name: \"pass2\",\n    className: \"bg-slate-100 my-1 h-3 border border-slate-200 placeholder:text-slate-500 text-sm p-2.5 placeholder:italic\",\n    placeholder: \"Retype password\"\n  })), /*#__PURE__*/React.createElement(\"input\", {\n    id: \"_csrf\",\n    type: \"hidden\",\n    name: \"_csrf\",\n    value: props.csrf\n  }), /*#__PURE__*/React.createElement(\"input\", {\n    className: \"formSubmit block rounded border border-1 border-slate-500 bg-slate-100 mx-auto my-4 px-2 hover:bg-emerald-100\",\n    type: \"submit\",\n    value: \"Sign up\"\n  }))));\n};\nconst init = async () => {\n  const response = await fetch('/getToken');\n  const data = await response.json();\n  const loginButton = document.getElementById('loginButton');\n  const signupButton = document.getElementById('signupButton');\n  loginButton.addEventListener('click', e => {\n    e.preventDefault();\n    helper.hideStatus();\n    ReactDOM.render( /*#__PURE__*/React.createElement(LoginWindow, {\n      csrf: data.csrfToken\n    }), document.getElementById('content'));\n    return false;\n  });\n  signupButton.addEventListener('click', e => {\n    e.preventDefault();\n    helper.hideStatus();\n    ReactDOM.render( /*#__PURE__*/React.createElement(SignupWindow, {\n      csrf: data.csrfToken\n    }), document.getElementById('content'));\n    return false;\n  });\n  ReactDOM.render( /*#__PURE__*/React.createElement(LoginWindow, {\n    csrf: data.csrfToken\n  }), document.getElementById('content'));\n};\nwindow.onload = init;\n\n//# sourceURL=webpack://mood-board-maker/./client/login.jsx?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./client/login.jsx");
/******/ 	
/******/ })()
;