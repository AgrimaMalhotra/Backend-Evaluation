'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class company extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.sector, { foreignKey: 'id' });
    }
  }
  company.init({
    companyId: DataTypes.NUMBER,
    name: DataTypes.STRING,
    ceo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'company',
  });
  return company;
};