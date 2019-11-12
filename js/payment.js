
var firebaseConfig =
{
    apiKey: "AIzaSyDxYYlUBMjfBO1M0KBlqaWo45NoXzzyqg0",
    authDomain: "school-management-2019-2a9bb.firebaseapp.com",
    databaseURL: "https://school-management-2019-2a9bb.firebaseio.com",
    projectId: "school-management-2019-2a9bb",
    storageBucket: "school-management-2019-2a9bb.appspot.com",
    messagingSenderId: "217528902443",
    appId: "1:217528902443:web:8a9c182e73a13901d29b6e",

  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
 var contractSource;
 var contractAddress;
 var client=null;

 $('#btn-make-payment').click(async function(){
      var rootRef=firebase.database().ref().child("Users");
     var userId=firebase.auth().currentUser.uid;
     var usersRef=rootRef.child(userId+"/payment");
     usersRef.set("paid");


     await contractCall('makePayment',[],1000000000000000000);
     window.location.href="MainPage.html";
 })

 async function callStatic(func,args)
 {
   const contract=await client.getContractInstance(contractSource,{contractAddress});
   const calledGet=await contract.call(func,args,{callStatic:true}).catch(e=>console.error(e));
   console.log('calledGet',calledGet);

   const decodeGet=await calledGet.decode().catch(e =>console.error(e));
   return decodeGet;
 }

 async function contractCall(func,arg,value){
   const contract=await client.getContractInstance(contractSource,{contractAddress});
   const calledGet=await contract.call(func,arg,{amount:value}).catch(e=>console.error(e));
   console.log('calledGet',calledGet);
 return calledGet;
 }

 document.getElementByClassName('btn').addEventListener('click',async()=>{
     contractAddress="ct_2t8nyrNCExXcWgLoNdCXvWLJo7RuDjQCc6Ryo84Xhep5GMVpD1";
     contractSource=`
      payable contract PayTuition =
            record state={myAddress:address}

            entrypoint init()={myAddress=ak_2bKhoFWgQ9os4x8CaeDTHZRGzUcSwcXYUrM12gZHKTdyreGRgG}

            payable stateful entrypoint makePayment()=
                Chain.spend(state.myAddress,Call.value)

                public entrypoint getTestValue():int= 5
     `;

     client = await Ae.Aepp();
     var tValue=await callStatic('getTestValue',[]);
     console.log(tValue);
     console.log("paid successful!!!")

 })
