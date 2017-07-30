client = Rapid.createClient("NDA1OWE0MWo1b3AzYzA3LnJhcGlkLmlv")
var b64 = "";

function previewImage(input){
	if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
        	b64 = reader.result;
        	console.log(b64)
            $('#avatar').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

function proceed(){
	const doc = client
	.collection('users')
	.newDocument() // generate the id of a new document automatically
	
	doc.mutate({ // create a new to-do and assign it to John
		name: $("#firstname").val(),
		image: b64,
	})
	.then(() => {
		document.cookie = "username=" + doc.id;
		document.location = "./index.html"
		})
}

$(function(){
	$("#profile-image").change(function(){
    	previewImage(this);
	});
	$("#button-signup").click(proceed);
})