/**
 * Copyright Schrodinger, LLC
 */

"use strict";

const FakeObjectDataListStore = require('./helpers/FakeObjectDataListStore');
const { TextCell } = require('./helpers/cells');
const { Table, Column, ColumnGroup, Cell } = require('fixed-data-table-2');
const React = require('react');

var columnTitles = {
  'firstName': 'First Name',
  'lastName': 'Last Name',
  'sentence': 'Sentence',
  'companyName': 'Company',
  'city': 'City',
  'street': 'Street',
  'zipCode': 'Zip Code'
};

var columnWidths = {
  firstName: 150,
  lastName: 150,
  sentence: 240,
  companyName: 100,
  city: 240,
  street: 260,
  zipCode: 240
};

var fixedColumns = [
  'firstName',
  'lastName'
];

class ReorderGroupsExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataList: new FakeObjectDataListStore(1000000),
      columnOrder: [
        { 
          key: 'name',
          subColumns: [
            { key: 'firstName' },
            { key: 'lastName' },
          ],
        },
        { 
          key: 'address',
          subColumns: [
            { key: 'city' },
            { key: 'street'},
            { key: 'zipCode'},
          ],
        },
        { key: 'sentence' },
        { key: 'companyName' },
      ],
    };

    this._onColumnReorderEndCallback = this._onColumnReorderEndCallback.bind(this);
  }

  _onColumnReorderEndCallback(event) {
    console.log(event);
    var columnOrder = this.state.columnOrder.filter((columnKey) => {
      return columnKey !== event.reorderColumn;
    });

    if (event.columnAfter) {
      var index = columnOrder.indexOf(event.columnAfter);
      columnOrder.splice(index, 0, event.reorderColumn);
    } else {
      if (fixedColumns.indexOf(event.reorderColumn) !== -1) {
        columnOrder.splice(fixedColumns.length - 1, 0, event.reorderColumn)
      } else {
        columnOrder.push(event.reorderColumn);
      }
    }
    this.setState({
      columnOrder: columnOrder
    });
  }

  renderColumns(columnOrder) {
    console.log('columnOrder: ', columnOrder);
    return columnOrder.map(function (column, i) {
      return column.subColumns
        ? (
          <ColumnGroup
            allowCellsRecycling={true}
            columnKey={column.key}
            key={i}
            isReorderable={true}
            header={<Cell>{columnTitles[column.key]}</Cell>}
            fixed={fixedColumns.indexOf(column.key) !== -1}
          >
            {this.renderColumns(column.subColumns)}
          </ColumnGroup>
        )
        : (
          <Column
            allowCellsRecycling={true}
            columnKey={column.key}
            key={i}
            isReorderable={true}
            header={<Cell>{columnTitles[column.key]}</Cell>}
            cell={<TextCell data={dataList} />}
            fixed={fixedColumns.indexOf(column.key) !== -1}
            width={columnWidths[column.key]}
          />
        );
    });
  }

  render() {
    console.log('render');
    var { dataList } = this.state;

    return (
      <Table
        rowHeight={30}
        headerHeight={50}
        rowsCount={dataList.getSize()}
        onColumnReorderEndCallback={this._onColumnReorderEndCallback}
        isColumnReordering={false}
        width={1000}
        height={500}
        {...this.props}>
        {this.renderColumns(this.state.columnOrder)}
      </Table>
    );
  }
}

console.log('ReorderGroupsExample: ', ReorderGroupsExample);
module.exports = ReorderGroupsExample;
