'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class sector extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.company, { foreignKey: 'id' });
    }
  }
  sector.init({
    sectorName: DataTypes.STRING,
    companyId: DataTypes.NUMBER,
    cpi: DataTypes.NUMBER,
    cf: DataTypes.NUMBER,
    mau: DataTypes.NUMBER,
    roic: DataTypes.NUMBER,
    score: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'sector',
  });
  return sector;
};