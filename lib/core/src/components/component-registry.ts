import { Container } from '../container/container.js';
import { ClassConstructor } from '../utils/types.js';
import { ComponentBinder } from './component-binder.js';
import { ComponentInfo } from './component-info.js';
import { DataRegistry } from './data/data-registry.js';
import { CoreDecorator } from './enums.js';
import { IComponentDecoratorInfo, IGetComponentsOptions, IGetDecoratorsOptions } from './interfaces.js';
import { ComponentMetadata } from './metadata.js';

/**
 * The ComponentRegistry class manages the registration and retrieval of components within an application.
 * It provides methods for registering components, retrieving comprehensive information about components,
 * and filtering components based on specific criteria.
 */
export class ComponentRegistry {
  
  private container: Container;
  private registeredComponents: ComponentInfo[];
  private componentBinder: ComponentBinder;
  private dataRegistry: DataRegistry;
  // private dataComponents: IDataComponentInfo[];

  constructor(container: Container) {
    this.container = container;
    this.registeredComponents = [];
    this.componentBinder = new ComponentBinder(container);
    this.dataRegistry = new DataRegistry();
    // this.dataComponents = [];
  }

  /**
   * Retrieves a list of ComponentInfo objects that contain comprehensive information about component classes, instances,
   * methods, decorators, and more. The returned list can be optionally filtered by the provided component id or decorator ID(s).
   * @param options An object containing options for filtering the list of components.
   * @returns An array of ComponentInfo objects.
   */
  get<T = any, D = any>(options?: IGetComponentsOptions): ComponentInfo<T, D>[] {
    let components = this.getComponents(options?.id);

    if (options?.decoratorIds) {
      components = this.filterComponentsByDecoratorIds(components, options.decoratorIds);
    }

    return components;
  }

  /**
   * Retrieves a ComponentInfo object that contains comprehensive information about a component class / instance.
   * @param component The component class or instance.
   * @returns A ComponentInfo object.
   */
  getInfo<T, D>(component: ClassConstructor | object) {
    let classConstructor = component instanceof Function ? component : component.constructor;

    return this.registeredComponents.find(comp => comp.getClass() === classConstructor) as ComponentInfo<T, D>;
  }

  /**
   * Returns decorators info from all components filtered by the passed options
   * @param id Decorator ID
   */
  getDecorators<T = any>(options: IGetDecoratorsOptions = {}) {
    return this
      // Get all components
      .getComponents()
      .map(comp => {
        // Get decorators from each component
        return comp
          .getDecorators<T>(options)
          .map(decoInfo => {
            return {
              ...decoInfo,
              componentInfo: comp
            } as IComponentDecoratorInfo<T>;
          })
      })
      .flat(1);
  }

  // getDataComponents() {
  //   const dataComponents = this.getComponents(CoreDecorator.DATA);    
  // }

  /**
   * Retrieves the list of exported ComponentInfo objects from the app.
   * @returns An array of ComponentInfo objects.
   */
  getExported() {
    return this.registeredComponents.filter(comp => comp.isExported());
  }

  getDataComponent(classConstructor: ClassConstructor) {
    return this.dataRegistry.getDataComponent(classConstructor);
  }

  /**
   * Register app components from a given classes list
   */
  register(classes: ClassConstructor[]) {
    classes.forEach(classConstructor => {
      const registration = ComponentMetadata.getComponentRegistration(classConstructor);

      if (!registration) return;

      const componentInfo = new ComponentInfo(classConstructor, registration, this.container);

      this.componentBinder.bindComponent(componentInfo);

      this.registeredComponents.push(componentInfo);
    });
  }

  /**
   * Register the exported components from the extensions 
   */
  registerExtension(componentRegistry: ComponentRegistry, extContainer: Container) {
    componentRegistry.getExported().forEach(componentInfo => {
      this.registeredComponents.push(componentInfo);

      this.componentBinder.bindExtensionComponent(componentInfo, extContainer);
    });
  }

  registerDataComponents() {
    this.dataRegistry.registerDataComponents(this.getComponents(CoreDecorator.DATA));
  }

  // private getDataComponentInfo(comp: ComponentInfo) {
  //   const fieldsDecorators = comp.getDecorators({ id: CoreDecorator.FIELD });
  //   const fields: any[] = [];

  //   for (const fieldDecorator of fieldsDecorators) {
  //     const { dataType, elementType } = fieldDecorator.data;

  //     let formattedDataType;

  //     if (dataType.name === 'UserDto') {
  //       const dataTypeCompInfo = this.registeredComponents.find(rc => rc.getClass() === dataType);
  //       formattedDataType = this.getDataComponentInfo(dataTypeCompInfo!);
  //     }
  //     else {
  //       formattedDataType = dataType.name.toLowerCase();
  //     }

  //     fields.push({
  //       property: fieldDecorator.property!,
  //       dataType: formattedDataType,
  //       elementType,
  //       // decorators: comp.getDecorators({ method: fieldDecorator.property })
  //     });

  //   }

  //   return {
  //     componentInfo: comp,
  //     fields
  //   };
  // }

  /**
   * Returns the total number of registered components.
   * @returns The total number of registered components.
   */
  count() {
    return this.registeredComponents.length;
  }

  private getComponents(id?: string) {
    let components: ComponentInfo[] = [];

    if (id) {
      components = [...this.registeredComponents.filter(comp => comp.getId() === id)];
    }
    else {
      components = [...this.registeredComponents];
    }

    return components;
  }

  private filterComponentsByDecoratorIds(components: ComponentInfo[], decoratorIds: string[]) {
    return components.filter(comp => {
      return comp.getDecoratorsIds().some(
        decoId => decoratorIds.includes(decoId)
      );
    });
  }
}