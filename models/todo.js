const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Todo = sequelize.define('Todo', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: '標題不能為空'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: ''
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
    }
  }, {
    timestamps: true, // 這會自動添加 createdAt 和 updatedAt
    hooks: {
      beforeUpdate: (todo, options) => {
        // 當完成狀態改變時，設定或清除 completedAt
        if (todo.changed('completed')) {
          if (todo.completed) {
            todo.completedAt = new Date();
          } else {
            todo.completedAt = null;
          }
        }
      }
    }
  });

  return Todo;
}; 