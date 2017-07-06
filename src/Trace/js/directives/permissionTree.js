/* Used by user and role permission settings. 
 */
MetronicApp.directive('permissionTree', [
      function () {
          return {
              restrict: 'E',
              template: '<div class="permission-tree"></div>',
              scope: {
                  editData: '='
              },
              link: function ($scope, element, attr) {

                  var $tree = $(element).find('.permission-tree');
                  var treeInitializedBefore = false;
                  var inTreeChangeEvent = false;

                  $scope.$watch('editData', function () {
                      if (!$scope.editData) {
                          return;
                      }

                      initializeTree();
                  });

                  function initializeTree() {
                      if (treeInitializedBefore) {
                          $tree.jstree('destroy');
                      }

                      var treeData = _.map($scope.editData, function (item) {
                          return {
                              id: item.id,
                              parent: item.pid ? item.pid : '#',
                              text: item.title,
                              state: {
                                  opened: true,
                                  selected: _.contains($scope.editData.allow, item.id)
                              }
                          };
                      });

                      $tree.jstree({
                          'core': {
                              data: treeData
                          },
                          "types": {
                              "default": {
                                  "icon": "fa fa-folder tree-item-icon-color icon-lg"
                              },
                              "file": {
                                  "icon": "fa fa-file tree-item-icon-color icon-lg"
                              }
                          },
                          'checkbox': {
                              keep_selected_style: false,
                              three_state: false,
                              cascade: ''
                          },
                          plugins: ['checkbox', 'types']
                      });

                      treeInitializedBefore = true;

                      $tree.on("changed.jstree", function (e, data) {
                          if (!data.node) {
                              return;
                          }

                          var wasInTreeChangeEvent = inTreeChangeEvent;
                          if (!wasInTreeChangeEvent) {
                              inTreeChangeEvent = true;
                          }

                          var childrenNodes;

                          if (data.node.state.selected) {
                              selectNodeAndAllParents($tree.jstree('get_parent', data.node));

                              childrenNodes = $.makeArray($tree.jstree('get_children_dom', data.node));
                              $tree.jstree('select_node', childrenNodes);

                          } else {
                              childrenNodes = $.makeArray($tree.jstree('get_children_dom', data.node));
                              $tree.jstree('deselect_node', childrenNodes);
                          }

                          if (!wasInTreeChangeEvent) {
                              $scope.$apply(function () {
                                  $scope.editData.allow = getSelectedPermissionNames();
                              });
                              inTreeChangeEvent = false;
                          }
                      });
                  };

                  function selectNodeAndAllParents(node) {
                      $tree.jstree('select_node', node, true);
                      var parent = $tree.jstree('get_parent', node);
                      if (parent) {
                          selectNodeAndAllParents(parent);
                      }
                  };

                  function getSelectedPermissionNames() {
                      var permissionNames = [];

                      var selectedPermissions = $tree.jstree('get_selected', true);
                      for (var i = 0; i < selectedPermissions.length; i++) {
                          permissionNames.push(selectedPermissions[i].id);
                      }

                      return permissionNames;
                  };
              }
          };
      }]);