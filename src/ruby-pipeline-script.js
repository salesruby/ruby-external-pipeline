(function () {
    this.RubyForm = function () {
        // Create global element references
        this.rubyForm = null;
        this.formValues = [];
        this.rubyFormContainer = null;
        this.rubySubmitButton = null;
        this.formFields = null;
        this.baseUrl = "https://server.rubystack.io";

        // Define default options
        let defaults = {
            colors : {
                formTopBorder : '#298530',
                formBorder : '#ced4da',
                formBorderFocus : '#80bdff',
                formShadowFocus : 'rgba(59,191,69,0.25)',
                formBackground : 'transparent',
                formFontColor : '#495057',
                formButtonBackground : '#298530',
                formButtonHover : '#2C404C'
            },
            successMessage: 'Thank you for getting in touch with us!',
            maxWidth : 480,
            minWidth : 300,
            key : ''
        }

        // Create options by extending defaults with the passed in arguments
        if (arguments[0] && typeof arguments[0] === "object") {
            this.options = extendDefaults(defaults, arguments[0]);
        }
    }

    // Init ruby stack plugins here
    RubyForm.prototype.init = function () {
        let _ = this;
        verifyAuthKey(this, _);
    }

    // Submit the form
    RubyForm.prototype.submit = function () {
        let _ = this,
            valid = validateFormInputs(_.formFields, _);
        if (valid) {
            let payload = {
                values : _.formValues,
                key : _.options.key
            };

            // Send the form values to company leads
            const ajax2 = new XMLHttpRequest();
            ajax2.onload = function() {
                let resp = JSON.parse(this.response);
                if (resp.success) {
                    let successSpan = document.createElement("span");
                    successSpan.className = "ruby-form-success";
                    successSpan.style.color = "#008000";
                    successSpan.style.fontWeight = "700";
                    successSpan.style.marginBottom = "30px";
                    successSpan.style.paddingBottom = "50px";
                    _.rubyFormContainer.style.paddingBottom = "80px"
                    successSpan.innerHTML = _.options.successMessage;
                    _.rubyForm.remove();
                    _.rubyFormContainer.appendChild(successSpan);
                }
            }
            ajax2.open("POST", _.baseUrl + "/api/external-integration/save-lead");
            ajax2.setRequestHeader("Content-type", "application/json");
            ajax2.setRequestHeader("Accept", "application/json");
            ajax2.send(JSON.stringify(payload));
        }
    }

    // Validate authorization key
    function verifyAuthKey(payload, _) {
        if ( typeof payload.options === "object") {
            if (payload.options.key !== null) {
                // verify key
                loadData(payload.options, _);
            }
        }
        return false;
    }

    function handleSuccessResponse(resp, _) {
        // Get the form fields
        _.formFields = resp.result.parameters;
        buildForm.call(_);
        setRubyStyle.call(_);
        initializeEvents.call(_);
    }

    function loadData(options, _) {
        const ajax = new XMLHttpRequest();
        ajax.onload = function() {
            let resp = JSON.parse(this.response);
            if (resp.success) {
                // Handle success response
                handleSuccessResponse(resp, _);
            }
        }
        ajax.open("POST", _.baseUrl + "/api/external-integration/get-lead-form-parameters");
        ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        ajax.send("key=" + options.key);
    }

    // On change handler to handle input changes
    function inputChange(event) {
        if (event.target.value.length > 2) {
            // check and remove error span if present
            let sibling = event.target.nextElementSibling;
            if (sibling !== null) {
                sibling.style.opacity = '0';
                setTimeout( () => {
                    sibling.remove();
                }, 1000);
            }
        }
    }

    // Build form elements and components
    function buildForm() {
        let container, docFrag;
        container = document.getElementById("ruby_pipeline");

        // Create document fragment to build with
        docFrag = document.createDocumentFragment();

        // Create form container and add needed properties
        this.rubyFormContainer = document.createElement("div");
        this.rubyFormContainer.className = "ruby-form-wrapper";
        this.rubyFormContainer.style.minWidth = this.options.minWidth + "px";
        this.rubyFormContainer.style.maxWidth = this.options.maxWidth + "px";

        // Create form body and add attributes
        this.rubyForm = document.createElement("form");
        this.rubyForm.className = "ruby-form";
        this.rubyForm.setAttribute("autocomplete", "off");

        // Create form contents
        if (typeof this.formFields === "object") {
            let tempForm = this.rubyForm;
            this.formFields.forEach(function (item, index) {
                    let formContainer = document.createElement("div");
                    formContainer.className = "ruby-form-group";

                    let formLabel = document.createElement("label");
                    formLabel.setAttribute("for", item.key);
                    formLabel.innerText = item.label;

                    let formInput = document.createElement("input");
                    if (item.key === 'email') {
                        formInput.setAttribute("type", "email");
                    } else {
                        formInput.setAttribute("type", "text");
                    }
                    formInput.setAttribute("name", item.key);
                    formInput.setAttribute("id", item.key);
                    formInput.setAttribute("class", "ruby-form-input");
                    formInput.setAttribute("autocomplete", "off");
                    formInput.setAttribute("placeholder", "Enter your " + item.label);
                    // Add event to each input element
                    formInput.addEventListener('keyup', inputChange.bind(this));

                    formContainer.appendChild(formLabel);
                    formContainer.appendChild(formInput);

                    tempForm.append(formContainer);
                });

            this.rubyForm  =  tempForm

            // Create submit button
            this.rubySubmitButton = document.createElement("button");
            this.rubySubmitButton.className = "ruby-form-submit";
            this.rubySubmitButton.id = "rubySubmit";
            this.rubySubmitButton.setAttribute("type", "button");
            this.rubySubmitButton.innerText = "Submit"
            // Append the button to form body
            this.rubyForm.append(this.rubySubmitButton);
        }

        // Append the form to form container
        this.rubyFormContainer.appendChild(this.rubyForm);

        // Append form container to documentFragment
        docFrag.appendChild(this.rubyFormContainer);

        // Append document fragment to body
        container.appendChild(docFrag);
    }

    // Write and set form css
    function setRubyStyle() {
        let rubyStyle = document.createElement("style");
        rubyStyle.setAttribute("type", "text/css")
        rubyStyle.innerHTML = '.ruby-form-wrapper{position: relative; box-sizing: border-box; margin: 20px; padding: 50px 20px; border: 1px solid '+ this.options.colors.formBorder +'; border-top: 3px solid '+ this.options.colors.formTopBorder +';}'+
            '.ruby-form-group label {display:inline-block; margin-bottom: .50rem; font-size: 1rem; color: '+ this.options.colors.formFontColor +'}'+
            '.ruby-form-group {display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-flex:0;-ms-flex:0 0 auto;flex:0 0 auto;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-ms-flex-flow:row wrap;flex-flow:row wrap;-webkit-box-align:center;-ms-flex-align:center;align-items:center;margin-bottom:1rem;}'+
            '.ruby-form-input {display:block;width:100%;padding:.595rem .75rem;font-size:1rem;line-height:1.2;color:#495057;background-color:#fff;background-clip:padding-box;border:1px solid '+ this.options.colors.formBorder +'; border-radius:0 !important;-webkit-transition:border-color 0.15s ease-in-out,-webkit-box-shadow 0.15s ease-in-out;transition:border-color 0.15s ease-in-out;-webkit-box-shadow 0.15s ease-in-out;transition:border-color 0.15s ease-in-out,box-shadow 0.15s ease-in-out;transition:border-color 0.15s ease-in-out,box-shadow 0.15s ease-in-out,-webkit-box-shadow 0.15s ease-in-out;}.ruby-form-input::-ms-expand{background-color:transparent;border:0}.ruby-form-input:focus{color:#495057;background-color:#fff;border-color:'+ this.options.colors.formBorderFocus +'; border-radius: 0;outline:0;-webkit-box-shadow:0 0 0 .2rem '+ this.options.colors.formShadowFocus +'; box-shadow:0 0 0 .1rem '+ this.options.colors.formShadowFocus +'} .ruby-form-input::-webkit-input-placeholder{color:#6c757d;opacity:0.7}.ruby-form-input:-ms-input-placeholder{color:#6c757d;opacity:0.7}.ruby-form-input::-ms-input-placeholder{color:#6c757d;opacity:0.7}.ruby-form-input::placeholder{color:#6c757d;opacity:.7}'+
            '.ruby-form-submit {font-weight:900 !important;cursor: pointer;border:none;border-radius:1.5rem;padding: 0.89rem 2.8rem;margin: 0;display:block; width:100%; color:#fff; background-color: '+ this.options.colors.formButtonBackground +';border-color: '+ this.options.colors.formButtonBackground +' !important; overflow:visible; text-transform:none;-webkit-appearance:button; margin:0;font-family:inherit;font-size:18px;line-height:inherit}.ruby-form-submit:focus{outline:0;} .ruby-form-submit::-moz-focus-inner {padding:0;border-style:none, outline:0}'+
            '.ruby-form-submit:hover {transition: all 0.5s ease-in;color:#fff;background-color: '+ this.options.colors.formButtonHover +';border-color: '+ this.options.colors.formButtonHover +' !important;}'+
            '.ruby-form-danger {color: #ff7272; font-size:11px;padding-top:5px;opacity: 1;-webkit-transition: opacity 1000ms linear;transition: opacity 1000ms linear;}'+
            '.ruby-form-success {color: #008000, font-weight: 700; margin-bottom: 20px; padding-bottom: 10px;}';
        document.head.appendChild(rubyStyle);
    }

    // Utility method to extend defaults with user options
    function extendDefaults(source, properties) {
        let property;
        for (property in properties) {
            if (properties.hasOwnProperty(property)) {
                source[property] = properties[property];
            }
        }
        return source;
    }

    // Initialise an on click action event on submit button
    function initializeEvents() {
        if (this.rubySubmitButton) {
            this.rubySubmitButton.addEventListener('click', this.submit.bind(this));
        }
    }

    // Validate email
    function validateEmail(value)
    {
        let mailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        return !!value.match(mailFormat);
    }

    // Validate submitted form
    function validateFormInputs(formFields, _) {
        let inValid = false;
        _.formValues = [];
        document
            .querySelectorAll('.ruby-form-input')
            .forEach( function (element, indexNode) {
            let value = element.value,
                errorMessage,
                field = formFields.find( x => x.key === element.getAttribute('name'));

            // Validate each input fields
            if (element.getAttribute('type') === 'email') {
                if (!validateEmail(value)) {
                    inValid = true;
                    errorMessage = " must be a valid address";
                }
            } else {
                if (value.length < 3){
                    inValid = true;
                    errorMessage = " must be filled out";
                }
            }

            // For each of the invalid fields, show error element and message
            if (inValid && typeof element.parentElement.children[2] === "undefined") {
                let errorSpan = document.createElement("span");
                errorSpan.className = "ruby-form-danger";
                errorSpan.innerHTML = field.label + errorMessage;
                element.parentElement.append(errorSpan);
            }

                _.formValues.push({ name: element.getAttribute('name'), value : value});
        });

        // Do not proceed if validation is not successful
        return !inValid;
    }

}());
