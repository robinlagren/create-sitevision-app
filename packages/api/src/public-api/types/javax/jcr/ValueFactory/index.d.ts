import type { Value } from "../Value";

import type { Binary } from "../Binary";
import type { Node } from "../Node";

/**
 * The <code>ValueFactory</code> object provides methods for the creation Value
 * objects that can then be used to set properties.
 * @since Sitevision 3.0
 */
export type ValueFactory = {
  /**
   * Returns a <code>Value</code> object of {@link PropertyType#STRING} with
   * the specified <code>value</code>.
   * @param value a <code>String</code>
   * @return a <code>Value</code> of {@link PropertyType#STRING}
   */
  createValue(value: string): Value;

  /**
   * Returns a <code>Value</code> object of {@link PropertyType#LONG} with the
   * specified <code>value</code>.
   * @param value a <code>long</code>
   * @return a <code>Value</code> of {@link PropertyType#LONG}
   */
  createValue(value: number): Value;

  /**
   * Returns a <code>Value</code> object of {@link PropertyType#DOUBLE} with
   * the specified <code>value</code>.
   * @param value a <code>double</code>
   * @return a <code>Value</code> of {@link PropertyType#DOUBLE}
   */
  createValue(value: number): Value;

  /**
   * Returns a <code>Value</code> object of {@link PropertyType#DECIMAL} with
   * the specified <code>value</code>.
   * @param value a <code>double</code>
   * @return a <code>Value</code> of {@link PropertyType#DECIMAL}
   * @since JCR 2.0
   */
  createValue(value: unknown): Value;

  /**
   * Returns a <code>Value</code> object of {@link PropertyType#BOOLEAN} with
   * the specified <code>value</code>.
   * @param value a <code>boolean</code>
   * @return a <code>Value</code> of {@link PropertyType#BOOLEAN}
   */
  createValue(value: boolean): Value;

  /**
   * Returns a <code>Value</code> object of {@link PropertyType#DATE} with the
   * specified <code>value</code>.
   * @param value a <code>Calendar</code>
   * @return a <code>Value</code> of {@link PropertyType#DATE}
   * @throws IllegalArgumentException if the specified <code>value</code> cannot be expressed in the ISO 8601-based format defined in the JCR 2.0 specification and the implementation does not support dates incompatible with that format.
   */
  createValue(value: unknown): Value;

  /**
   * Returns a <code>Value</code> object of {@link PropertyType#REFERENCE}
   * that holds the identifier of the specified <code>Node</code>. This
   * <code>Value</code> object can then be used to set a property that will be
   * a reference to that <code>Node</code>.
   * @param value a <code>Node</code>
   * @return a <code>Value</code> of {@link PropertyType#REFERENCE}
   * @throws RepositoryException if the specified <code>Node</code> is not referenceable, the current <code>Session</code> is no longer active, or another error occurs.
   */
  createValue(value: Node): Value;
};
