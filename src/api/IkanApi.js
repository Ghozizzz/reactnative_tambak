import {fr} from '../config/firebase';

// export async function getIkan(ikanRetrieve){
  
//   var ikanList = [];
//   var getOptions = {
//     source: 'cache'
//   };
//   var snapshot = await fr.collection('MasterIkan')
//   .orderBy('name')
//   .get(getOptions);

//   snapshot.forEach((doc) => {
//     const ikanItem = doc.data();
//     ikanItem.id = doc.id;
//     ikanList.push(ikanItem);
//   });

//   ikanRetrieve(ikanList);
// }

export function deleteIkan(id) {
  fr.collection('MasterIkan')
    .doc(id).delete()
    .then(() => {
      alert('Data berhasil dihapus')
    })
    .catch((error) => console.log(error));
}