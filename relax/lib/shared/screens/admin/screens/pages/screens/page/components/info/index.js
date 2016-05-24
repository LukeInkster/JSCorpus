import bind from 'decorators/bind';
import Component from 'components/component';
import PageInfo from 'components/content-page-info';
import React, {PropTypes} from 'react';
import {removePage, publishPage, unpublishPage} from 'actions/page';
import {bindActionCreators} from 'redux';
import {dataConnect} from 'relate-js';

@dataConnect(
  (state) => ({
    pageId: state.router.params.id
  }),
  (dispatch) => bindActionCreators({removePage, publishPage, unpublishPage}, dispatch),
  (props) => ({
    fragments: {
      page: {
        _id: 1,
        title: 1,
        state: 1,
        date: 1,
        updatedDate: 1,
        createdBy: {
          _id: 1,
          email: 1,
          name: 1
        },
        updatedBy: {
          _id: 1,
          email: 1,
          name: 1
        }
      }
    },
    variablesTypes: {
      page: {
        _id: 'ID!'
      }
    },
    initialVariables: {
      page: {
        _id: props.pageId
      }
    }
  })
)
export default class PageInfoContainer extends Component {
  static propTypes = {
    pageId: PropTypes.string.isRequired
  };

  getInitState () {
    return {
      removeConfirm: false
    };
  }

  @bind
  onDelete () {
    this.setState({
      removeConfirm: true
    });
  }

  @bind
  cancelDelete () {
    this.setState({
      removeConfirm: false
    });
  }

  @bind
  confirmRemovePage () {
    const {pageId} = this.props;
    this.props.removePage(pageId, true);
  }

  @bind
  publishPage () {
    const {pageId} = this.props;
    this.props.publishPage(pageId);
  }

  @bind
  unpublishPage () {
    const {pageId} = this.props;
    this.props.unpublishPage(pageId);
  }

  render () {
    const {page} = this.props;
    const {removeConfirm} = this.state;
    return (
      <PageInfo
        item={page}
        removeConfirm={removeConfirm}
        onDelete={this.onDelete}
        cancelDelete={this.cancelDelete}
        confirmRemove={this.confirmRemovePage}
        publish={this.publishPage}
        unpublish={this.unpublishPage}
      />
    );
  }
}
