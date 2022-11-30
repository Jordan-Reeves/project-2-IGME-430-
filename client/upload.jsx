const helper = require('./helper.js');
const { useState, createContext, useContext } = React;
const UserContext = createContext()

let selectOptions = ["Test", "Create New"];

const uploadFile = async (e) => {
    e.preventDefault();

    const boardVal = e.target.querySelector('#board').value;
    // sends file to the server
    console.log(boardVal);
    // not found = -1 aka it was in create
    if(!selectOptions.includes(boardVal)){
        selectOptions.unshift(boardVal);
    } 
    const response = await fetch(`/upload?board=${boardVal}`, {
        method: 'POST',
        headers:{
            'X-CSRF-TOKEN': e.target.querySelector('#_csrf').value,
        },
        body: new FormData(e.target), // serializes the form, need to do to be able to send files
        // body: formData, // serializes the form, need to do to be able to send files
    });

    loadImagesFromServer();
    // ReactDOM.render(
    //     <MoodImageForm csrf={e.target.querySelector('#_csrf').value} boardSelect="select"/>, 
    //     document.getElementById('uploadForm')
    // );-
    // console.log(await response);
    const text = await response.text();
    helper.handleError(text);
};

const handleDeleteImage = (e) => {
    e.preventDefault();
    helper.hideError();

    const imgID = e.target.querySelector('#imgID').value;
    const _csrf = e.target.querySelector('#_csrf').value;

    helper.sendPost(e.target.action, {imgID, _csrf}, loadImagesFromServer);
    return false;
}

const MoodImageForm = (props) => {
    const [boardSelect, setBoardSelect] = useState(props.boardSelect);
    const value = { boardSelect, setBoardSelect };

    return (
        <form
        id='uploadForm' 
        action='/upload' 
        onSubmit={() => {uploadFile(); setBoardSelect("select");}}
        method='post' 
        encType="multipart/form-data">
          <label for="sampleFile">Choose an image:</label>
          <input type="file" name="sampleFile" />
          {/* <label for="board">Choose a board:</label>
          <select id="board" name="board">
            <option value="Board 1">Board 1</option>
            <option value="Board 2">Board 2</option>
          </select> */}
          <UserContext.Provider value={value}>
            <WhichBoard boardSelect={value}/>
          </UserContext.Provider>

          <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
          <input type='submit' value='Upload!' />
      </form> 
    );
};

const MoodImageList = (props) => {
    if(props.moodImages.length === 0){
        return (
            <div className='moodImageList'>
                <h3 className='emptyList'>No Mood Images Yet!</h3>
            </div>
        );
    }

    const moodImagesNodes = props.moodImages.map(moodImage => {
        return (
            <div key={moodImage._id} className="moodImage" id={moodImage._id}>
                <h3>{moodImage.name}</h3>
                <form id="deleteMoodImage"
                    name="deleteMoodImage"
                    onSubmit={handleDeleteImage}
                    action="/deleteMoodImage"
                    method="POST"
                    className="deleteMoodImage"
                >
                    <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
                    <input id="imgID" type="hidden" name="imgID" value={moodImage._id} />
                    <input className="deleteMoodImageSubmit" type="submit" value="X"/>
                </form>
                <img src={`/retrieve?_id=${moodImage._id}`} style={{maxWidth:  500+'px'}}/>
            </div>
        );
    });

    return (
        <div className='moodImagesList'>
            {moodImagesNodes}
        </div>
    )
}

const WhichBoard = (props) => {
    // const [boardSelect, setBoardSelect] = useState(props.boardSelect);
    // console.log(boardSelect);
    // console.log(props.boardSelect);

    // console.log(selectOptions);

    const {boardSelect, setBoardSelect }= useContext(UserContext);


    if(boardSelect == "Create New"){
        return (
            <>
                <label for="board">Create a new board:</label>
                <input id="board" type="text" name="board" />
            </> 
        );
    } else { // choose existing/select
        return (
            <>
                <label for="board">Choose a board:</label>
                <select id="board" name="board" onChange={(e) => {setBoardSelect(e.target.value)}}>
                    {selectOptions.map(option => {
                        return(
                            <option value={option}>{option}</option>
                        )
                    })}
                </select>
            </>
        );
    }
};

const loadImagesFromServer = async () => {
    const response = await fetch('/getImages');
    const data = await response.json();

    const responseToken = await fetch('/getToken');
    const token = await responseToken.json();
    ReactDOM.render(
        <MoodImageList csrf={token.csrfToken} moodImages={data.moodImages}/>, 
        document.getElementById('moodImages')
    );
}

// const renderForm = async () => {
//     const response = await fetch('/getToken');
//     const data = await response.json();

//     console.log("re-rendered");
//     ReactDOM.render(
//         <MoodImageForm csrf={data.csrfToken} boardSelect="create"/>, 
//         document.getElementById('uploadForm')
//     );

// }

const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    ReactDOM.render(
        <MoodImageForm csrf={data.csrfToken} boardSelect="select"/>, 
        document.getElementById('uploadForm')
    );

    ReactDOM.render(
        <MoodImageList csrf={data.csrfToken} moodImages={[]}/>, 
        document.getElementById('moodImages')
    );

    loadImagesFromServer();
}

window.onload = init;