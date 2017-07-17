(function () {
    angular.module("MetronicApp")
        .controller("views.series.index",
        ["$scope", "$state", "settings", "dataFactory","$uibModal",
            function ($scope, $state, settings, dataFactory, $uibModal) {
                // ajax初始化
                $scope.$on("$viewContentLoaded",
                    function() {
                        App.initAjax();
                    });
                var vm = this;
                vm.organizationTree = {
                    $tree: null,
                    unitCount: 0,
                    setUnitCount: function (unitCount) {
                        $scope.safeApply(function () {
                            vm.organizationTree.unitCount = unitCount;
                        });
                    },
                    refreshUnitCount: function () {
                        vm.organizationTree.setUnitCount(vm.organizationTree.$tree.jstree('get_json').length);
                    },
                    selectedOu: {
                        id: null,
                        displayName: null,
                        code: null,
                        set: function (ouInTree) {
                            if (!ouInTree) {
                                vm.organizationTree.selectedOu.id = null;
                                vm.organizationTree.selectedOu.displayName = null;
                                vm.organizationTree.selectedOu.code = null;
                            } else {
                                vm.organizationTree.selectedOu.id = ouInTree.id;
                                vm.organizationTree.selectedOu.displayName = ouInTree.original.displayName;
                                vm.organizationTree.selectedOu.code = ouInTree.original.code;
                            }
                            vm.members.load();
                        }
                    },
                    contextMenu: function (node) {
                        var items = {
                            editUnit: {
                                label: '编辑',
                                _disabled: false,
                                action: function (data) {
                                    var instance = $.jstree.reference(data.reference);
                                    vm.organizationTree.openCreateOrEditUnitModal({
                                        id: node.id,
                                        displayName: node.original.displayName
                                    }, function (updatedOu) {
                                        node.original.displayName = updatedOu.name;
                                        instance.rename_node(node, vm.organizationTree.generateTextOnTree(updatedOu));
                                    });
                                }
                            },
                            addSubUnit: {
                                label: '添加',
                                _disabled: false,
                                action: function () {
                                    vm.organizationTree.addUnit(node.id);
                                }
                            },
                            //addMember: {
                            //    label: '添加人员',
                            //    _disabled: false,
                            //    action: function () {
                            //        vm.members.openAddModal();
                            //    }
                            //},
                            'delete': {
                                label: '删除',
                                _disabled: false,
                                action: function (data) {
                                    var instance = $.jstree.reference(data.reference);
                                    abp.message.confirm(
                                        "确定要删除:"+node.original.displayName,
                                        function (isConfirmed) {
                                            if (isConfirmed) {
                                                var url = "api/category/delete";
                                                dataFactory.action(url, "", null, {id:node.id}).then(function (res) {
                                                    if (res.success) {
                                                        abp.notify.success("成功删除");
                                                        instance.delete_node(node);
                                                        vm.organizationTree.refreshUnitCount();
                                                    } else {
                                                        abp.notify.error(res.error);
                                                    }
                                                });
                                                //organizationUnitService.deleteOrganizationUnit({
                                                //    id: node.id
                                                //}).then(function () {
                                                //    abp.notify.success(app.localize('SuccessfullyDeleted'));
                                                //    instance.delete_node(node);
                                                //    vm.organizationTree.refreshUnitCount();
                                                //});
                                            }
                                        }
                                    );
                                }
                            }
                        }
                        return items;
                    },
                    addUnit: function (parentId) {
                        var instance = $.jstree.reference(vm.organizationTree.$tree);
                        vm.organizationTree.openCreateOrEditUnitModal({
                            parentId: parentId
                        }, function (newOu) {
                            instance.create_node(
                                parentId ? instance.get_node(parentId) : '#',
                                {
                                    id: newOu.id,
                                    parent: newOu.parentId ? newOu.parentId : '#',
                                    code: newOu.code,
                                    displayName: newOu.name,
                                    memberCount: 0,
                                    text: vm.organizationTree.generateTextOnTree(newOu),
                                    state: {
                                        opened: true
                                    }
                                });
                            vm.organizationTree.refreshUnitCount();
                        });
                    },
                    openCreateOrEditUnitModal: function (organizationUnit, closeCallback) {
                        var modal = $uibModal.open({
                            templateUrl: 'views/series/modal.html',
                            controller: 'views.series.modal as vm',
                            backdrop: 'static',
                            //   size: 'lg', //模态框的大小尺寸
                            resolve: {
                                org: function () { return  organizationUnit }
                            }
                        });
                        modal.result.then(function (response) {
                            closeCallback && closeCallback(response);
                        });
                      
                    },

                    generateTextOnTree: function (ou) {
                        var itemClass = ou.memberCount > 0 ? ' ou-text-has-members' : ' ou-text-no-members';
                        return '<span title="' + ou.name + '" class="ou-text' +
                            itemClass + '" data-ou-id="' + ou.id + '">' + ou.name + ' <i class="fa fa-caret-down text-muted"></i></span>';
                    },

                    incrementMemberCount: function (ouId, incrementAmount) {
                        var treeNode = vm.organizationTree.$tree.jstree('get_node', ouId);
                        treeNode.original.memberCount = treeNode.original.memberCount + incrementAmount;
                        vm.organizationTree.$tree.jstree('rename_node', treeNode, vm.organizationTree.generateTextOnTree(treeNode.original));
                    },

                    getTreeDataFromServer: function (callback) {
                        dataFactory.action("api/category/getAll", "", null, {  })
                      .then(function (res) {
                          if (res.success) {
                              var list = res.result;
            
                              var treeData = _.map(list, function (item) {
                                  return {
                                      id: item.id,
                                      parent: item.pid ? item.pid : '#',
                                      code: '',
                                      displayName: item.name,
                                      memberCount: 0,
                                      text: vm.organizationTree.generateTextOnTree(item),
                                      state: {
                                          opened: true
                                      }
                                  };
                              });
                              callback(treeData);
                          } else {
                              abp.notify.error(res.error);
                          }
                      });


                     
                    },

                    init: function () {
                        vm.organizationTree.getTreeDataFromServer(function (treeData) {
                            vm.organizationTree.setUnitCount(treeData.length);
                            vm.organizationTree.$tree = $('#OrganizationUnitEditTree');
                            var jsTreePlugins = [
                                'types',
                                'contextmenu',
                                'wholerow',
                                'sort'
                            ];
                           
                            vm.organizationTree.$tree
                                //.on('changed.jstree', function (e, data) {
                                //    $scope.safeApply(function () {
                                //        if (data.selected.length != 1) {
                                //            vm.organizationTree.selectedOu.set(null);
                                //        } else {
                                //            var selectedNode = data.instance.get_node(data.selected[0]);
                                //            vm.organizationTree.selectedOu.set(selectedNode);
                                //        }
                                //    });
                                //})
                                //.on('move_node.jstree', function (e, data) {
                                //    if (!vm.permissions.manageOrganizationTree) {
                                //        vm.organizationTree.$tree.jstree('refresh'); //rollback
                                //        return;
                                //    }
                                //    var parentNodeName = (!data.parent || data.parent == '#')
                                //        ? app.localize('Root')
                                //        : vm.organizationTree.$tree.jstree('get_node', data.parent).original.displayName;
                                //    abp.message.confirm(
                                //        app.localize('OrganizationUnitMoveConfirmMessage', data.node.original.displayName, parentNodeName),
                                //        function (isConfirmed) {
                                //            if (isConfirmed) {
                                //                organizationUnitService.moveOrganizationUnit({
                                //                    id: data.node.id,
                                //                    newParentId: data.parent
                                //                }).then(function () {
                                //                    abp.notify.success(app.localize('SuccessfullyMoved'));
                                //                    vm.organizationTree.reload();
                                //                }).catch(function (err) {
                                //                    vm.organizationTree.$tree.jstree('refresh'); //rollback
                                //                    setTimeout(function () { abp.message.error(err.data.message); }, 500);
                                //                });
                                //            } else {
                                //                vm.organizationTree.$tree.jstree('refresh'); //rollback
                                //            }
                                //        }
                                //    );
                                //})
                                .jstree({
                                    'core': {
                                        data: treeData,
                                        multiple: false,
                                        check_callback: function (operation, node, node_parent, node_position, more) {
                                            return true;
                                        }
                                    },
                                    types: {
                                        "default": {
                                            "icon": "fa fa-folder tree-item-icon-color icon-lg"
                                        },
                                        "file": {
                                            "icon": "fa fa-file tree-item-icon-color icon-lg"
                                        }
                                    },
                                    contextmenu: {
                                        items: vm.organizationTree.contextMenu
                                    },
                                    sort: function (node1, node2) {
                                        if (this.get_node(node2).original.displayName < this.get_node(node1).original.displayName) {
                                            return 1;
                                        }

                                        return -1;
                                    },
                                    plugins: jsTreePlugins
                                });

                            vm.organizationTree.$tree.on('click', '.ou-text .fa-caret-down', function (e) {
                                e.preventDefault();

                                var ouId = $(this).closest('.ou-text').attr('data-ou-id');
                                setTimeout(function () {
                                    vm.organizationTree.$tree.jstree('show_contextmenu', ouId);
                                }, 100);
                            });
                        });
                    },

                    reload: function () {
                        vm.organizationTree.getTreeDataFromServer(function (treeData) {
                            vm.organizationTree.setUnitCount(treeData.length);
                            vm.organizationTree.$tree.jstree(true).settings.core.data = treeData;
                            vm.organizationTree.$tree.jstree('refresh');
                        });
                    }
                };
                vm.organizationTree.init();
            }
        ]);
})();

