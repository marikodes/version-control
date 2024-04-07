import addOnUISdk from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";

addOnUISdk.ready.then(async () => {
    console.log("addOnUISdk is ready for use.");

    // Get the UI runtime.
    const { runtime } = addOnUISdk.instance;

    // Get the proxy object, which is required
    // to call the APIs defined in the Document Sandbox runtime
    // i.e., in the `code.js` file of this add-on.
    const sandboxProxy = await runtime.apiProxy("documentSandbox");

    const createRectangleButton = document.getElementById("createRectangle");
    createRectangleButton.addEventListener("click", async event => {
        await sandboxProxy.createRectangle();
    });


    const versionList = document.getElementById("versionList");
    const versions = [];
    class Version {
        constructor(name, thumbnail, imageState) {
            this.name = name;
            this.thumbnail  = thumbnail; 
            this.imageState = imageState;
            this.time = new Date().toLocaleString(); // Get current time
        }
    }

    const saveVersionButton = document.getElementById("saveVersion");
    const saveNameButton = document.getElementById("versionBlock");
    const nameButton = document.getElementById("vname");
    const confirmNameButton = document.getElementById("confirmName");

    saveVersionButton.addEventListener("click", async event => {
        saveNameButton.style.display="block"
        nameButton.contentEditable = true;
        nameButton.focus(); // Set focus on the nameButton field

    })

    confirmNameButton.addEventListener("click", async event => {
        saveNameButton.style.display = "none";
        nameButton.contentEditable = false;
        const currentVersion=""
        const versionName=nameButton.innerText;
        const thumbnail =""

        nameButton.innerText=""

        const response = await addOnUISdk.app.document.createRenditions({
            range: "currentPage",
            format: "image/jpeg",
        });

        const downloadUrl = URL.createObjectURL(response[0].blob);        

        console.log("url: ", downloadUrl)
        // Check if the user entered a name
        if (versionName) {
            // Create a new version object with the entered name
            const newVersion = new Version(versionName, downloadUrl, currentVersion);
            versions.push(newVersion);

            console.log("whoooah")
            // Update the UI to display the list of version names
            displayVersions();
        } else {
            console.log("what??")
            // Inform the user that they need to enter a name
            alert("Please enter a version name.");
        }
    });

    // Function to display the list of versions
    function displayVersions() {
            console.log("versions: ", versions)

            versionList.innerHTML = ""; // Clear previous content
            
            versions.forEach(function(version) {
                const box = document.createElement("div");
                
                box.classList.add("version-box");
                box.innerHTML = `
                    <div><img src="${version.thumbnail}" alt="Version Image"></div>
                    <div>
                    <div>Name: ${version.name}</div>
                    <div>Time: ${version.time}</div>
                    <div>
                        <button>Download this version</div>
                        <button>Load this version</div>
                    </div>
                    </div>
                `;
                versionList.appendChild(box);
            });
        }


    // Enable the button only when:
    // 1. `addOnUISdk` is ready,
    // 2. `sandboxProxy` is available, and
    // 3. `click` event listener is registered.
    createRectangleButton.disabled = false;
});
