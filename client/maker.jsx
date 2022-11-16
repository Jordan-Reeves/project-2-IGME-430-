const helper = require('./helper.js');

const uploadFile = async (e) => {
    e.preventDefault();

    // where and body
    // sends file to the server
    const response = await fetch('/upload', {
        method: 'POST',
        body: new FormData(e.target), // serializes the form, need to do to be able to send files
    });

    const text = await response.text();
    document.getElementById('messages').innerText = text;
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
    return (
        <form ref='uploadForm' 
        id='uploadForm' 
        action='/upload' 
        onSubmit={uploadFile}
        method='post' 
        encType="multipart/form-data">
          <input type="file" name="sampleFile" />
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
            </div>
        );
    });

    return (
        <div className='moodImagesList'>
            {moodImagesNodes}
        </div>
    )
}

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

const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    ReactDOM.render(
        <MoodImageForm csrf={data.csrfToken}/>, 
        document.getElementById('uploadForm')
    );

    ReactDOM.render(
        <MoodImageList csrf={data.csrfToken} moodImages={[]}/>, 
        document.getElementById('moodImages')
    );

    loadImagesFromServer();
}

window.onload = init;