import React from 'react';
import ListviewTab from './ListviewTab/ListviewTab';
import classes from './ListviewTabs.css';

const listviewTabs = (props) => {
	const tabs = props.tabs.map( (tab) => {
//console.log(tab.key);
//console.log(tab.url);
//console.log(tab.label);
//console.log("-------");
        return <ListviewTab key={tab.key} to={tab.url} label={tab.label}/>
    });
 
	return(
		// <div>123</div>
		<header>
			<nav className={classes.nav}>
				<ul>{tabs}</ul>
			</nav>
		</header>
	);
}

// 	(
//     <ul>
// 		props.tabs.map( (tab) => {
// 			<ListviewTab key={tab.key} to={tab.url} label={tab.label}/>
//     	});
//     </ul>
// );

export default listviewTabs;