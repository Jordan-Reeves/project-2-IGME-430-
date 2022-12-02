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

eval("/* Takes in an error message. Sets the error message up in html, and\r\n   displays it to the user. Will be hidden by other events that could\r\n   end in an error.\r\n*/\nconst handleError = message => {\n  document.getElementById('errorMessage').textContent = message;\n  document.getElementById('domoMessage').classList.remove('hidden');\n};\n\n/* Sends post requests to the server using fetch. Will look for various\r\n   entries in the response JSON object, and will handle them appropriately.\r\n*/\nconst sendPost = async (url, data, handler) => {\n  const response = await fetch(url, {\n    method: 'POST',\n    headers: {\n      'Content-Type': 'application/json'\n    },\n    body: JSON.stringify(data)\n  });\n  const result = await response.json();\n  document.getElementById('domoMessage').classList.add('hidden');\n  if (result.redirect) {\n    window.location = result.redirect;\n  }\n  if (result.error) {\n    handleError(result.error);\n  }\n  if (handler) {\n    handler(result);\n  }\n};\nconst hideError = () => {\n  document.getElementById('domoMessage').classList.add('hidden');\n};\nmodule.exports = {\n  handleError,\n  sendPost,\n  hideError\n};\n\n//# sourceURL=webpack://mood-board-maker/./client/helper.js?");

/***/ }),

/***/ "./client/upload.jsx":
/*!***************************!*\
  !*** ./client/upload.jsx ***!
  \***************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("const helper = __webpack_require__(/*! ./helper.js */ \"./client/helper.js\");\nconst {\n  useState,\n  createContext,\n  useContext\n} = React;\nconst UserContext = createContext();\nlet selectOptions = [];\nconst uploadFile = async (e, callback) => {\n  e.preventDefault();\n  const boardVal = e.target.querySelector('#board').value;\n  // console.log(boardVal);\n\n  // add value to the list of boards\n  if (!selectOptions.includes(boardVal)) {\n    handleAddBoard(boardVal, e.target.querySelector('#_csrf').value);\n  }\n  // sends file to the server\n  const response = await fetch(`/upload?board=${boardVal}`, {\n    method: 'POST',\n    headers: {\n      'X-CSRF-TOKEN': e.target.querySelector('#_csrf').value\n    },\n    body: new FormData(e.target) // serializes the form, need to do to be able to send files\n  });\n\n  loadImagesFromServer();\n  const boards = await fetch('/getBoards');\n  const boardData = await boards.json();\n  selectOptions = boardData.userBoards[0].boards;\n  // console.log(selectOptions);\n\n  // console.log(await response);\n  const text = await response.text();\n  helper.handleError(text);\n  callback();\n};\nconst handleDeleteImage = e => {\n  e.preventDefault();\n  helper.hideError();\n  const imgID = e.target.querySelector('#imgID').value;\n  const _csrf = e.target.querySelector('#_csrf').value;\n  helper.sendPost(e.target.action, {\n    imgID,\n    _csrf\n  }, loadImagesFromServer);\n  return false;\n};\nconst handleAddBoard = (newBoard, _csrf) => {\n  helper.hideError();\n  helper.sendPost('/addBoard', {\n    newBoard,\n    _csrf\n  }, loadBoardsFromServer);\n  return false;\n};\nconst MoodImageForm = props => {\n  const [boardSelect, setBoardSelect] = useState(props.boardSelect);\n  const [storedSelectOptions, setStoredSelectOptions] = useState(props.selectOptions);\n  const value = {\n    boardSelect,\n    setBoardSelect,\n    storedSelectOptions,\n    setStoredSelectOptions\n  };\n  return /*#__PURE__*/React.createElement(\"form\", {\n    id: \"uploadForm\",\n    action: \"/upload\",\n    onSubmit: e => {\n      uploadFile(e, () => {\n        setBoardSelect(\"select\");\n        setStoredSelectOptions(selectOptions);\n      });\n    },\n    method: \"post\",\n    encType: \"multipart/form-data\"\n  }, /*#__PURE__*/React.createElement(\"label\", {\n    for: \"sampleFile\"\n  }, \"Choose an image:\"), /*#__PURE__*/React.createElement(\"input\", {\n    type: \"file\",\n    name: \"sampleFile\"\n  }), /*#__PURE__*/React.createElement(UserContext.Provider, {\n    value: value\n  }, /*#__PURE__*/React.createElement(WhichBoard, {\n    boardSelect: value\n  })), /*#__PURE__*/React.createElement(\"input\", {\n    id: \"_csrf\",\n    type: \"hidden\",\n    name: \"_csrf\",\n    value: props.csrf\n  }), /*#__PURE__*/React.createElement(\"input\", {\n    type: \"submit\",\n    value: \"Upload!\"\n  }));\n};\nconst MoodImageList = props => {\n  if (props.moodImages.length === 0) {\n    return /*#__PURE__*/React.createElement(\"div\", {\n      className: \"moodImageList\"\n    }, /*#__PURE__*/React.createElement(\"h3\", {\n      className: \"emptyList\"\n    }, \"No Mood Images Yet!\"));\n  }\n  const moodImagesNodes = props.moodImages.map(moodImage => {\n    return /*#__PURE__*/React.createElement(\"div\", {\n      key: moodImage._id,\n      className: \"moodImage\",\n      id: moodImage._id\n    }, /*#__PURE__*/React.createElement(\"h3\", null, moodImage.name), /*#__PURE__*/React.createElement(\"form\", {\n      id: \"deleteMoodImage\",\n      name: \"deleteMoodImage\",\n      onSubmit: handleDeleteImage,\n      action: \"/deleteMoodImage\",\n      method: \"POST\",\n      className: \"deleteMoodImage\"\n    }, /*#__PURE__*/React.createElement(\"input\", {\n      id: \"_csrf\",\n      type: \"hidden\",\n      name: \"_csrf\",\n      value: props.csrf\n    }), /*#__PURE__*/React.createElement(\"input\", {\n      id: \"imgID\",\n      type: \"hidden\",\n      name: \"imgID\",\n      value: moodImage._id\n    }), /*#__PURE__*/React.createElement(\"input\", {\n      className: \"deleteMoodImageSubmit\",\n      type: \"submit\",\n      value: \"X\"\n    })), /*#__PURE__*/React.createElement(\"img\", {\n      src: `/retrieve?_id=${moodImage._id}`,\n      style: {\n        maxWidth: 500 + 'px'\n      }\n    }));\n  });\n  return /*#__PURE__*/React.createElement(\"div\", {\n    className: \"moodImagesList\"\n  }, moodImagesNodes);\n};\nconst WhichBoard = props => {\n  const {\n    boardSelect,\n    setBoardSelect,\n    storedSelectOptions,\n    setStoredSelectOptions\n  } = useContext(UserContext);\n  if (boardSelect == \"Create New\") {\n    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(\"label\", {\n      for: \"board\"\n    }, \"Create a new board:\"), /*#__PURE__*/React.createElement(\"input\", {\n      id: \"board\",\n      type: \"text\",\n      name: \"board\"\n    }));\n  } else {\n    // choose existing/select\n    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(\"label\", {\n      for: \"board\"\n    }, \"Choose a board:\"), /*#__PURE__*/React.createElement(\"select\", {\n      id: \"board\",\n      name: \"board\",\n      onChange: e => {\n        setBoardSelect(e.target.value);\n      }\n    }, storedSelectOptions.map(option => {\n      return /*#__PURE__*/React.createElement(\"option\", {\n        key: option,\n        value: option\n      }, option);\n    })));\n  }\n};\nconst loadImagesFromServer = async () => {\n  const response = await fetch('/getImages');\n  const data = await response.json();\n  const responseToken = await fetch('/getToken');\n  const token = await responseToken.json();\n  ReactDOM.render( /*#__PURE__*/React.createElement(MoodImageList, {\n    csrf: token.csrfToken,\n    moodImages: data.moodImages\n  }), document.getElementById('moodImages'));\n};\nconst loadBoardsFromServer = async () => {\n  const response = await fetch('/getBoards');\n  const data = await response.json();\n  selectOptions = data.userBoards[0].boards;\n  console.log(selectOptions);\n};\n\n// const renderForm = async () => {\n//     const response = await fetch('/getToken');\n//     const data = await response.json();\n\n//     console.log(\"re-rendered\");\n//     ReactDOM.render(\n//         <MoodImageForm csrf={data.csrfToken} boardSelect=\"create\"/>, \n//         document.getElementById('uploadForm')\n//     );\n\n// }\n\nconst init = async () => {\n  const response = await fetch('/getToken');\n  const data = await response.json();\n  const boards = await fetch('/getBoards');\n  const boardData = await boards.json();\n  selectOptions = boardData.userBoards[0].boards;\n  console.log(selectOptions);\n  ReactDOM.render( /*#__PURE__*/React.createElement(MoodImageForm, {\n    csrf: data.csrfToken,\n    boardSelect: \"select\",\n    selectOptions: selectOptions\n  }), document.getElementById('uploadForm'));\n  ReactDOM.render( /*#__PURE__*/React.createElement(MoodImageList, {\n    csrf: data.csrfToken,\n    moodImages: []\n  }), document.getElementById('moodImages'));\n  loadImagesFromServer();\n};\nwindow.onload = init;\n\n//# sourceURL=webpack://mood-board-maker/./client/upload.jsx?");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./client/upload.jsx");
/******/ 	
/******/ })()
;