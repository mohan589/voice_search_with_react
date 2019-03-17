import React, { Component } from 'react'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'

class SearchTable extends Component {
  constructor (props) {
    super(props)
    this.state = {
      results: [],
      voiceController: null
    }
  }

  componentWillMount () {
    let _this = this
    console.log('voiceController', this.props.results)

    _this.setState({
      results: this.props.results,
      voiceController: this.props.voiceController
    })
  }

  render () {
    const { results, voiceController } = this.state
    function imageFormatter (cell, row) {
      return "<img width=100 height=100 src='" + cell + "'/>"
    }
    voiceController.on(['i would see *'], true).then((i, data) => {
      results.map(obj => {
        if (obj.title.toLowerCase() === data.toLowerCase()) {
          voiceController.say('you said ' + data)
        }
      })
    })

    voiceController.on(['ok I am done *'], true).then((i, wildcard) => {
      voiceController.say('oh that is great, see you again, bye for now')
      voiceController.fatality()
    })

    return (
      <div>
        <BootstrapTable data={results}>
          <TableHeaderColumn isKey dataField='title'>
            Title
          </TableHeaderColumn>
          <TableHeaderColumn dataField='description'>
            Description
          </TableHeaderColumn>
          <TableHeaderColumn dataFormat={imageFormatter} dataField='imageUrl'>
            Image
          </TableHeaderColumn>
          <TableHeaderColumn dataField='contentType'>
            ContentType
          </TableHeaderColumn>
        </BootstrapTable>
      </div>
    )
  }
}

export default SearchTable
