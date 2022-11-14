const helper = require('./helper.js');

const handleDomo = (e) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector('#domoAge').value;
    const color = e.target.querySelector('#domoColor').value;
    const _csrf = e.target.querySelector('#_csrf').value;

    if(!name || !age || !color){
        helper.handleError('All fields are required!');
        return false;
    }

    helper.sendPost(e.target.action, {name, age, color, _csrf}, loadDomosFromServer);
    return false;
}

const handleDeleteDomo = (e) => {
    e.preventDefault();
    helper.hideError();

    const domoID = e.target.querySelector('#domoID').value;
    const _csrf = e.target.querySelector('#_csrf').value;

    helper.sendPost(e.target.action, {domoID, _csrf}, loadDomosFromServer);
    return false;
}

const DomoForm = (props) => {
    return (
        <form id="domoForm"
            name="domoForm"
            onSubmit={handleDomo}
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name"/>
            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="number" min="0" name="age"/>
            <label htmlFor="color">Color: </label>
            <input id="domoColor" type="text" name="color" placeholder="Domo Color"/>
            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeDomoSubmit" type="submit" value="Make Domo"/>
        </form>
    );
};

const DomoList = (props) => {
    if(props.domos.length === 0){
        return (
            <div className='domoList'>
                <h3 className='emptyDomo'>No Domos Yet!</h3>
            </div>
        );
    }

    const domoNodes = props.domos.map(domo => {
        return (
            <div key={domo._id} className="domo" id={domo._id}>
                <img src="/assets/img/domoface.jpeg" alt="domo face" className='domoFace' />
                <h3 className='domoName'>Name: {domo.name}</h3>
                <h3 className='domoAge'>Age: {domo.age}</h3>
                <h3 className='domoColor'>Color: {domo.color}</h3>
                <form id="deleteDomo"
                    name="deleteDomo"
                    onSubmit={handleDeleteDomo}
                    action="/deleteDomo"
                    method="POST"
                    className="deleteDomo"
                >
                    <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
                    <input id="domoID" type="hidden" name="domoID" value={domo._id} />
                    <input className="deleteDomoSubmit" type="submit" value="X"/>
                </form>
            </div>
        );
    });

    return (
        <div className='domoList'>
            {domoNodes}
        </div>
    )
}

const loadDomosFromServer = async () => {
    const response = await fetch('/getDomos');
    const data = await response.json();

    const responseToken = await fetch('/getToken');
    const token = await responseToken.json();
    ReactDOM.render(
        <DomoList csrf={token.csrfToken} domos={data.domos}/>, 
        document.getElementById('domos')
    );
}

const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    ReactDOM.render(
        <DomoForm csrf={data.csrfToken}/>, 
        document.getElementById('makeDomo')
    );

    ReactDOM.render(
        <DomoList csrf={data.csrfToken} domos={[]}/>, 
        document.getElementById('domos')
    );

    loadDomosFromServer();
}

window.onload = init;