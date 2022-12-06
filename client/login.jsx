const helper = require('./helper.js');

// Function to login users
const handleLogin = (e) => {
    e.preventDefault();
    helper.hideStatus();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const _csrf = e.target.querySelector('#_csrf').value;

    if(!username || !pass){
        helper.sendStatus({error:'Username or password is empty!'});
        return false;
    }

    helper.sendPost(e.target.action, {username, pass, _csrf});
    return false;


}

// Function to signup users
const handleSignup = (e) => {
    e.preventDefault();
    helper.hideStatus();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;
    const _csrf = e.target.querySelector('#_csrf').value;

    if(!username || !pass || !pass2){
        helper.sendStatus({error:'All fields are required!'});
        return false;
    }
    if(pass !== pass2){
        helper.sendStatus({error:'Passwords do not match!'});
        return false;
    }

    helper.sendPost(e.target.action, {username, pass, pass2, _csrf});
    return false;
}

// Component for logingin
const LoginWindow = (props) => {
    return (
        <div className='relative w-full h-full'>
            <div className='absolute top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%]'>
                <h2 className='text-lg font-semibold text-center mb-4'>Login</h2>
                <form id="loginForm"
                    name="loginForm"
                    onSubmit={handleLogin}
                    action="/login"
                    method="POST"
                    className="mainForm"
                >
                    {/* <label htmlFor="username">Username: </label>
                    <input id="user" type="text" name="username" placeholder="Username"/>
                    <label htmlFor="pass">Pasword: </label>
                    <input id="pass" type="password" name="pass" placeholder="Password"/>
                    <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
                    <input className="formSubmit" type="submit" value="Sign in"/> */}

                    <div className='block'>
                        <label htmlFor="username" className="pr-2">Username: </label>
                        <input id="user" type="text" name="username" className="bg-slate-100 my-1 h-3 border border-slate-200 placeholder:text-slate-500 text-sm p-2.5 placeholder:italic" placeholder="New password"/>
                    </div>
                    <div className='block'>
                        <label htmlFor="pass" className="pr-2">Password: </label>
                        <input id="pass" type="password" name="pass" className="bg-slate-100 my-1 h-3 border border-slate-200 placeholder:text-slate-500 text-sm p-2.5 placeholder:italic" placeholder="New password"/>
                    </div>
                    <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
                    <input className="formSubmit block rounded border border-1 border-slate-500 bg-slate-100 mx-auto my-4 px-2 hover:bg-emerald-100" type="submit" value="Sign in"/>
                
                </form>
            </div>
        </div>
    );
};

// Component for signingup
const SignupWindow = (props) => {
    return (
        <div className='relative w-full h-full'>
            <div className='absolute top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%]'>
                <h2 className='text-lg font-semibold text-center mb-4'>Sign Up!</h2>
                <form id="signupForm"
                    name="signupForm"
                    onSubmit={handleSignup}
                    action="/signup"
                    method="POST"
                    className="mainForm"
                >
                    {/* <label htmlFor="username">Username: </label>
                    <input id="user" type="text" name="username" placeholder="Username"/>
                    <label htmlFor="pass">Pasword: </label>
                    <input id="pass" type="password" name="pass" placeholder="Password"/>
                    <label htmlFor="pass2">Pasword: </label>
                    <input id="pass2" type="password" name="pass2" placeholder="Retype password"/>
                    <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
                    <input className="formSubmit" type="submit" value="Sign in"/> */}

                    <div className='block'>
                        <label htmlFor="username" className="pr-2">Username: </label>
                        <input id="user" type="text" name="username" className="bg-slate-100 my-1 h-3 border border-slate-200 placeholder:text-slate-500 text-sm p-2.5 placeholder:italic" placeholder="New password"/>
                    </div>
                    <div className='block'>
                        <label htmlFor="pass" className="pr-2">Password: </label>
                        <input id="pass" type="password" name="pass" className="bg-slate-100 my-1 h-3 border border-slate-200 placeholder:text-slate-500 text-sm p-2.5 placeholder:italic" placeholder="New password"/>
                    </div>
                    <div className='block'>
                        <label htmlFor="pass2" className="pr-2">Password: </label>
                        <input id="pass2" type="password" name="pass2" className="bg-slate-100 my-1 h-3 border border-slate-200 placeholder:text-slate-500 text-sm p-2.5 placeholder:italic" placeholder="Retype password"/>
                    </div>
                    <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
                    <input className="formSubmit block rounded border border-1 border-slate-500 bg-slate-100 mx-auto my-4 px-2 hover:bg-emerald-100" type="submit" value="Sign up"/>
                        
                </form>
            </div>
        </div>
    );
};


const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    const loginButton = document.getElementById('loginButton');
    const signupButton = document.getElementById('signupButton');

    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        helper.hideStatus();
        ReactDOM.render(<LoginWindow csrf={data.csrfToken} />,
            document.getElementById('content'));
        return false;
    });

    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        helper.hideStatus();
        ReactDOM.render(<SignupWindow csrf={data.csrfToken} />,
            document.getElementById('content'));
        return false;
    });

    ReactDOM.render(<LoginWindow csrf={data.csrfToken} />,
        document.getElementById('content'));
};

window.onload = init;