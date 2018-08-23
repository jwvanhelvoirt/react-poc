import React, { Component } from 'react';
import { connect } from 'react-redux';
import { InputGroup, Input } from 'reactstrap';
import Button from '../../../UI/Button/Button';
import * as types from '../../../../store/Actions';
import { withRouter } from 'react-router-dom';

class ToolbarSearch extends Component {
  state = {
    searchText: ""
  }

  deleteSearchtextHandler = () => {
    this.setState(
      { searchText: "" }
    );
  }

  executeSearchHandler = () => {
    this.props.onSearch(this.state.searchText);
    this.props.history.push('/search?query=' + this.state.searchText);
  }

  changeHandler = (event) => {
    this.setState(
      { searchText: event.target.value }
    );
  }

  componentDidMount() {
    //console.log(this.props);
  }

  render() {
    return (
      <div>
        <InputGroup>
          <Button
            color="secondary"
            outline
            dataTip="React-tooltip"
            id="Searchbar-Delete"
            labelIcon="times-circle"
            tooltip="Zoektekst verwijderen"
            clicked={this.deleteSearchtextHandler}
            />
          <Input placeholder="Zoeken..." value={this.state.searchText} onChange={this.changeHandler} />
          <Button
            color="secondary"
            outline
            dataTip="React-tooltip"
            id="Searchbar-Search"
            labelText="Zoeken"
            tooltip="Zoeken in database op de server"
            clicked={this.executeSearchHandler}
            />
        </InputGroup>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSearch: (searchText) => dispatch( {type: types.SEARCHTEXT_OVERALL, searchText } )
  }
}

export default connect(null, mapDispatchToProps)(withRouter(ToolbarSearch));
