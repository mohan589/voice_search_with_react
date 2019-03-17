import React, { Component } from 'react'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'

class SearchTable extends Component {
  constructor (props) {
    super(props)
    this.state = {
      results: [],
      Jarvis: null
    }
  }

  componentWillMount () {
    let _this = this
    console.log('Jarvis', this.props.results)

    _this.setState({
      results: this.props.results,
      Jarvis: this.props.Jarvis
    })
  }

  render () {
    const { results, Jarvis } = this.state
    Jarvis.on(['i would see *'], true).then((i, data) => {
      results.map(obj => {
        if (obj.title.toLowerCase() === data.toLowerCase()) {
          Jarvis.say('you said ' + data)
        }
      })
    })

    Jarvis.on(['ok I am done *'], true).then((i, wildcard) => {
      Jarvis.say('oh that is great, see you again, bye for now')
      Jarvis.fatality()
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
          <TableHeaderColumn dataField='imageUrl'>
            Image
          </TableHeaderColumn>
        </BootstrapTable>
      </div>
    )
  }
}

export default SearchTable
