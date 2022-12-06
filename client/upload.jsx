const helper = require('./helper.js');
const { useState, createContext, useContext } = React;
const UserContext = createContext();
import Masonry from 'react-masonry-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons'

// Array to store the different boards a user has
// Then used to dynamically create the select options for WhichBoard
let selectOptions = [];

// Is premium mode enabled?
let premiumMode;

// Function for uploading a file
const uploadFile = async (e, callback) => {
    e.preventDefault();

    // Additional values to send to the server
    const boardVal = e.target.querySelector('#board').value;
    const fileName = e.target.querySelector('#fileName').value;

    // Add boardVal to the list of boards in Mongo
    if(!selectOptions.includes(boardVal)){
        handleAddBoard(boardVal, e.target.querySelector('#_csrf').value);
    } 

    // Send file to the server
    const response = await fetch(`/upload?board=${boardVal}&fileName=${fileName}`, {
        method: 'POST',
        headers:{
            'X-CSRF-TOKEN': e.target.querySelector('#_csrf').value,
        },
        body: new FormData(e.target), // serializes the form, need to do to be able to send files
    });

    // Reload the images from mongo
    loadImagesFromServer(boardVal);

    // Reload the boards from mongo
    const boards = await fetch('/getBoards');
    const boardData = await boards.json();

    selectOptions = boardData.userBoards[0].boards;

    const res = await response.json();
    helper.sendStatus(res);

    callback();
};

// Function for deleting a mood image
const handleDeleteImage = (e) => {
    e.preventDefault();
    helper.hideStatus();

    const imgID = e.target.querySelector('#imgID').value;
    const _csrf = e.target.querySelector('#_csrf').value;
    const board = e.target.querySelector('#board').value;

    // helper.sendPost(e.target.action, {imgID, _csrf,board}, (res) => {loadImagesFromServer(board); helper.sendStatus(`${res.message}`)});
    helper.sendPost(e.target.action, {imgID, _csrf,board}, (res) => {loadImagesFromServer(board); helper.sendStatus(res)});
    return false;
}

// Function for adding a new board
const handleAddBoard = (newBoard, _csrf) => {
    helper.hideStatus();

    helper.sendPost('/addBoard', {newBoard, _csrf}, loadBoardsFromServer);
    return false;
}



// Component to for the form to upload an image and change boards
const MoodImageForm = (props) => {
    const [boardSelect, setBoardSelect] = useState(props.boardSelect);
    const [storedSelectOptions, setStoredSelectOptions] = useState(props.selectOptions);
    const value = { boardSelect, setBoardSelect, storedSelectOptions, setStoredSelectOptions};

    return (
        <form
        id='uploadForm' 
        action='/upload' 
        onSubmit={(e) => {uploadFile(e, () => {  setStoredSelectOptions(selectOptions); setBoardSelect("select");}); }}
        method='post' 
        encType="multipart/form-data"
        className='flex flex-row justify-between space-x-1 mx-2 max-w-5xl'>
          <UserContext.Provider value={value}>
            <WhichBoard boardSelect={value}/>
          </UserContext.Provider>
          <div className='inline mt-1'>
            <label className="inline mb-2 text-sm" htmlFor="sampleFile"><FontAwesomeIcon icon={faCloudArrowUp} className="pr-2"/></label>
            <input className="inline text-sm text-slate-500 border border-slate-200 cursor-pointer bg-slate-50" name="sampleFile" type="file"/>
          </div>

          <div className='inline'>
            <label htmlFor="fileName" className="pr-2">Rename the file:</label>
            <input id="fileName" type="text" name="fileName" className="bg-slate-100 my-1 h-3 border border-slate-200 placeholder:text-slate-500 text-sm p-2.5 placeholder:italic" placeholder="Ex. Snow"/>
          </div>

          <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
          <input type='submit' value='Upload!' className="rounded border border-1 border-slate-500 bg-slate-100 m-1 px-2 hover:bg-emerald-100"/>
      </form> 
    );
};

// Component to swich the form from input/create select/existing board
const WhichBoard = (props) => {
    const {boardSelect, setBoardSelect, storedSelectOptions, setStoredSelectOptions } = useContext(UserContext);


    if(boardSelect == "Create New"){
        return (
            <>
                {/* <label htmlFor="board">Create a new board:</label>
                <input id="board" type="text" name="board" /> */}
                <label htmlFor="board" className="pr-2">Create new board:</label>
                <input id="board" type="text" name="board" className="bg-slate-100 my-1 h-3 border border-slate-200 placeholder:text-slate-500 text-sm p-2.5 placeholder:italic" placeholder="Ex. New board"/>
            </> 
        );
    } else { // choose existing/select
        return (
            <div className='inline my-1'>
            <label htmlFor="board" className="inline mr-2 mb-2 text-gray-900">Select an option:</label>
            <select id="board" name="board" onChange={(e) => {setBoardSelect(e.target.value); loadImagesFromServer(e.target.value); helper.hideStatus();}} className="inline bg-slate-100 border border-slate-500 text-slate-500 text-sm">
                
                {/* <label htmlFor="board">Choose a board:</label>
                <select id="board" name="board" onChange={(e) => {setBoardSelect(e.target.value); loadImagesFromServer(e.target.value); helper.hideStatus();}}> */}
                    {storedSelectOptions.map(option => {
                        return(
                            <option key={option} value={option}>{option}</option>
                        )
                    })}
                </select>
            </div>
        );
    }
};

// Component for each individual image card
const MoodImageCard = (props) => {
    return (
        <>
            <div className="moodImage m-3" id={props._id}>
                <div className="imageText flex flex-row justify-between">
                    <h3 className="font-semibold">{props.name}</h3>
                    <form id="deleteMoodImage"
                        name="deleteMoodImage"
                        onSubmit={handleDeleteImage}
                        action="/deleteMoodImage"
                        method="POST"
                        className="deleteMoodImage mb-2"
                    >
                        <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
                        <input id="imgID" type="hidden" name="imgID" value={props._id} />
                        <input id="board" type="hidden" name="board" value={props.board} />
                        <input className="deleteMoodImageSubmit px-2 py-0 rounded border border-1 border-slate-500 bg-slate-100 hover:bg-rose-200" type="submit" value="X"/>
                    </form>
                </div>
                <img src={props.imgSrc} style={{maxWidth:  350+'px'}}/>
            </div>
            {props.add == "true" ?
                <div className="moodImage m-3">
                    <h3 className="font-semibold">Add</h3>
                    <img src='https://via.placeholder.com/350x200?text=Add'/>
                </div>
                : 
                <></>
            }
        </>
    )

}

// Component for making the list of mood images, this includes making the adds
const MoodImageList = (props) => {
    if(props.moodImages.length === 0){
        return (
            <div className='moodImageList'>
                <h3 className='emptyList'>No Mood Images Yet!</h3>
            </div>
        );
    }

    const moodImagesNodes = props.moodImages.map((moodImage, index) => {
        if(premiumMode == false){
            if(index % 2 == 1){
                return (
                    <MoodImageCard key={moodImage._id} _id={moodImage._id} csrf={props.csrf} name={moodImage.name} add="true" board={moodImage.board} imgSrc={`/retrieve?_id=${moodImage._id}`}/>
                );
            } else{
                return (
                    <MoodImageCard key={moodImage._id} _id={moodImage._id} csrf={props.csrf} name={moodImage.name} add="false" board={moodImage.board} imgSrc={`/retrieve?_id=${moodImage._id}`}/>
                );
            }
        } else{
            return (
                <MoodImageCard key={moodImage._id} _id={moodImage._id} csrf={props.csrf} name={moodImage.name} add="false" board={moodImage.board} imgSrc={`/retrieve?_id=${moodImage._id}`}/>
            );
        }
    });

    const masonryOptions = {
        transitionDuration: 0
    };
    return (
        // <div className='moodImagesList'>
        //     {moodImagesNodes}
        // </div>
        <Masonry
            className={'image-masonry'} // default ''
            options={masonryOptions} // default {}
        >
            {moodImagesNodes}
        </Masonry>
    )
}



// Load images from the server but only for a specific board
const loadImagesFromServer = async (boardVal) => {
    const response = await fetch(`/getImages?board=${boardVal ? boardVal : "Board 1"}`);
    const data = await response.json();

    const responseToken = await fetch('/getToken');
    const token = await responseToken.json();

    ReactDOM.unmountComponentAtNode(document.getElementById('moodImages'));

    ReactDOM.render(
        <MoodImageList csrf={token.csrfToken} moodImages={data.moodImages} premiumMode={premiumMode}/>, 
        document.getElementById('moodImages')
    );
}

// Load the array of a users boards
const loadBoardsFromServer = async () => {
    const response = await fetch('/getBoards');
    const data = await response.json();

    selectOptions = data.userBoards[0].boards;
    console.log(selectOptions);

}


// Changing the Password

// Function to check if the password matches the stored password
const handleCheckPass = async (e) => {
    e.preventDefault();
    helper.hideStatus();

    const pass = e.target.querySelector('#pass').value;
    const _csrf = e.target.querySelector('#_csrf').value;

    if(!pass){
        helper.sendStatus({message:'Password is empty!'});
        return false;
    }
    
    helper.sendPost('/checkPassword', {pass, _csrf}, (result) => {
        if(result.canChange){
            helper.sendStatus(result)
            ReactDOM.render(<ChangePassWindow csrf={_csrf} />,
                document.getElementById('changePass'));
        } else{
            helper.sendStatus(result)
        }
        
    });
    return false;
}

// Component for checking if the password matches the stored password
const CheckPassWindow = (props) => {
    return (
        <div className='relative w-full h-full'>
            <div className='absolute top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%]'>
                <h2 className='text-lg font-semibold text-center mb-4'>Confirm your password to continue</h2>
                <form id="checkPassForm"
                name="checkPassForm"
                onSubmit={handleCheckPass}
                action="/checkPassword"
                method="POST"
                className="mainForm "
                >
                    <div className='inline'>
                        <label htmlFor="pass" className="pr-2">Current Password: </label>
                        <input id="pass" type="password" name="pass" className="bg-slate-100 my-1 h-3 border border-slate-200 placeholder:text-slate-500 text-sm p-2.5 placeholder:italic" placeholder="Password"/>
                    </div>
                    <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
                    <input className="formSubmit block rounded border border-1 border-slate-500 bg-slate-100 mx-auto my-4 px-2 hover:bg-emerald-100" type="submit" value="Confirm"/>
                </form>
            </div>
        </div>

    );
};


// Function to change the stored password to a new one
const handleChangePass = async (e) => {
    e.preventDefault();
    helper.hideStatus();

    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;
    const _csrf = e.target.querySelector('#_csrf').value;

    if(!pass || !pass2){
        helper.sendStatus({message:'Password must be typed twice'});
        return false;
    }
    
    helper.sendPost('/changePassword', {pass, pass2, _csrf}, (result) => {
        helper.sendStatus(result);
    });
    
    return false;
}

// Component for changing the stored password to a new one
const ChangePassWindow = (props) => {
    return (
        <div className='relative w-full h-full'>
            <div className='absolute top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%]'>
                <h2 className='text-lg font-semibold text-center mb-4'>Enter your new password!</h2>
                <form id="signupForm"
                    name="signupForm"
                    onSubmit={handleChangePass}
                    action="/changePassword"
                    method="POST"
                    className="mainForm"
                >
                    <div className='block'>
                        <label htmlFor="pass" className="pr-2">New Password: </label>
                        <input id="pass" type="password" name="pass" className="bg-slate-100 my-1 h-3 border border-slate-200 placeholder:text-slate-500 text-sm p-2.5 placeholder:italic" placeholder="New password"/>
                    </div>
                    <div className='block'>
                        <label htmlFor="pass2" className="pr-2">Retype Password: </label>
                        <input id="pass2" type="password" name="pass2" className="bg-slate-100 my-1 h-3 border border-slate-200 placeholder:text-slate-500 text-sm p-2.5 placeholder:italic" placeholder="Retype password"/>
                    </div>
                    <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
                    <input className="formSubmit block rounded border border-1 border-slate-500 bg-slate-100 mx-auto my-4 px-2 hover:bg-emerald-100" type="submit" value="Change"/>
                </form>
            </div>
        </div>
    );
};


// Gets the csrf token, loads the boards, renders the form, renders the images, add event listeners
const init = async () => {
    // Get the csrf token
    const response = await fetch('/getToken');
    const data = await response.json();

    // Load the arrary of users boards
    const boards = await fetch('/getBoards');
    const boardData = await boards.json();

    // Get value of the checkbox for premium mode
    // Add an event listener to reload page if checkbox changed
    const premiumModeCheck = document.getElementById('premiumMode');
    premiumMode = premiumModeCheck.checked;

    premiumModeCheck.addEventListener('change', (e) => {
        e.preventDefault();
        premiumMode = premiumModeCheck.checked;
        loadImagesFromServer(document.getElementById("board").value);
        return false;
    });

    // Store the values of the boards
    selectOptions = boardData.userBoards[0].boards;

    // Render the form
    ReactDOM.render(
        <MoodImageForm csrf={data.csrfToken} boardSelect="select" selectOptions={selectOptions}/>, 
        document.getElementById('uploadForm')
    );

    // Load the images and render the component to display them
    loadImagesFromServer(selectOptions[0]);


    // Add event listener to go to render the CheckPassWindow when Change Password is clicked
    const changePassButton = document.getElementById('changePassButton');
    changePassButton.addEventListener('click', (e) => {
        e.preventDefault();

        // Unmount the other components to "clear" the screen
        ReactDOM.unmountComponentAtNode(document.getElementById('moodImages'));
        ReactDOM.unmountComponentAtNode(document.getElementById('uploadForm'));

        ReactDOM.render(<CheckPassWindow csrf={data.csrfToken} />,
            document.getElementById('changePass'));
        return false;
    });

    // Add event listener to go to render the MoodImageForm & MoodImageList when Boards is clicked
    const viewBoardsButton = document.getElementById('boards');
    viewBoardsButton.addEventListener('click', (e) => {
        e.preventDefault();
        helper.hideStatus();

        // Unmount the changePass component to "clear" the screen
        ReactDOM.unmountComponentAtNode(document.getElementById('changePass'));
        ReactDOM.unmountComponentAtNode(document.getElementById('uploadForm'));

        loadImagesFromServer(selectOptions[0]);
        ReactDOM.render(
            <MoodImageForm csrf={data.csrfToken} boardSelect="select" selectOptions={selectOptions}/>, 
            document.getElementById('uploadForm')
        );
        return false;
    });
}

window.onload = init;










// // Function for adding a new board
// const handleDeleteBoard = (oldBoard, _csrf) => {
//     helper.hideStatus();

//     helper.sendPost('/deleteBoard', {oldBoard, _csrf}, loadBoardsFromServer);
//     return false;
// }