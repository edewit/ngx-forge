import { ProjectSelect } from './project-select.component';
import { Option } from '../../model/base.model';

describe('Project select component', () => {
  let projectSelect = new ProjectSelect(null, null, null);
  projectSelect.config = {
    classes: ['Node', 'Spring', 'WildFly', 'Eclipse'],
    techPreview: ['Node'],
    renderType: 'title'
  };

  it('should find the classname for an option', () => {
    // given
    let option = { id: 'Eclipse Vert.x'} as Option;

    // when
    let clazz = projectSelect.className(option);

    // then
    expect(clazz).toBe('Eclipse');
  });

  it('should mark options as tech preview', () => {
    // given
    let optionWildfly = { id: 'WildFly Swarm'} as Option;
    let optionNode = { id: 'Node.js'} as Option;

    // when
    let isTechPreviewWildfly = projectSelect.techPreview(optionWildfly);
    let isTechPreviewNode = projectSelect.techPreview(optionNode);

    // then
    expect(isTechPreviewWildfly).toBe(false);
    expect(isTechPreviewNode).toBe(true);
  });

  it('should record project id once selected', () => {
    // given
    let optionNode = { id: 'Node.js'} as Option;

    // when
    projectSelect.setSelected(optionNode);

    // then
    expect(projectSelect.isSelected(optionNode)).toBe(true);
  });

});
