import React from 'react';
import Responsive from 'react-responsive';

const Desktop = props => <Responsive {...props} minWidth={1280} />;
const Tablet = props => <Responsive {...props} minWidth={768} maxWidth={1279} />;
const Mobile = props => <Responsive {...props} maxWidth={767} />;

const screen = (props) => {
  const desktop = 'Desktop or laptop';
  const tablet = 'Tablet';
  const mobile = 'Mobile';

  return(
    <div>
      <Desktop>{desktop}</Desktop>
      <Tablet>{tablet}</Tablet>
      <Mobile>{mobile}</Mobile>
    </div>
  );
}

export default screen;




// <div class="large">
//   <div class="listview-wrapper">
//     <div class="listview">
//       <div class="listview-bar">ORG (L)</div>
//       <div class="listview-content">
//         <p>Listview</p>
//       </div>
//     </div>
//   </div>
//   <div class="listview-wrapper">
//     <div class="listview">
//       <div class="listview-bar">PERS-PROJ-TAAK (L)</div>
//       <div class="listview-content">
//         <p>Listview</p>
//       </div>
//     </div>
//   </div>
//   <div class="listview-wrapper">
//     <div class="listview">
//       <div class="listview-bar">COR/EMAIL/ORGANIGRAM (L)</div>
//       <div class="listview-content">
//         <p>Listview</p>
//       </div>
//     </div>
//     <div class="listview">
//       <div class="listview-bar">HIST/COR/EMAIL (L)</div>
//       <div class="listview-content">
//         <p>Listview</p>
//       </div>
//     </div>
//   </div>
// </div>
