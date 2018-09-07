import React, { Component } from 'react';

import Modal from '../../components/ui/modal/modal';
import Aux from '../auxiliary';

const withErrorHandler = (WrappedComponent, axios) => {
	return class extends Component {
		state = {
			error: null
		}
		componentDidMount() {
			axios.interceptors.request.use(req => {
				this.setState({ error: null });
				return req;
			});
			axios.interceptors.response.use((res, error) => {
				this.setState({ error: error });
				return res;
			});
		}

		errorConfirmedHandler = () => {
			this.setState({ error: null });
		}

		render() {
			return (
				<Aux>
					<Modal
						show={this.state.error}
						modalClass='ModalMedium'
						modalClosed={this.errorConfirmedHandler}>
						{this.state.error ? this.state.error.message : null}
				</Modal>
					<WrappedComponent {...this.props} />
				</Aux>
			);
		}
	}
}

export default withErrorHandler;
